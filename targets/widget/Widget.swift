import WidgetKit
import SwiftUI

// MARK: - Data Model

struct PrayerData: Codable {
    let nextPrayerName: String
    let nextPrayerTime: String   // ISO 8601 string
    let updatedAt: String
}

func loadPrayerData() -> PrayerData? {
    guard
        let defaults = UserDefaults(suiteName: "group.com.ramadanapp.shared"),
        let json = defaults.string(forKey: "ramadan_widget_data"),
        let data = json.data(using: .utf8),
        let parsed = try? JSONDecoder().decode(PrayerData.self, from: data)
    else {
        return nil
    }
    return parsed
}

func parseISO(_ str: String) -> Date? {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter.date(from: str) ?? ISO8601DateFormatter().date(from: str)
}

func countdown(to target: Date) -> String {
    let diff = max(0, Int(target.timeIntervalSinceNow))
    let h = diff / 3600
    let m = (diff % 3600) / 60
    let s = diff % 60
    return String(format: "%02d:%02d:%02d", h, m, s)
}

// MARK: - Timeline Provider

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), nextPrayerName: "Maghrib", countdown: "04:22:10")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let entry = makeEntry()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        var entries: [SimpleEntry] = []
        let now = Date()

        // Generate 60 entries, one per minute
        for minuteOffset in 0..<60 {
            let entryDate = Calendar.current.date(byAdding: .minute, value: minuteOffset, to: now)!
            entries.append(makeEntry(at: entryDate))
        }

        // Refresh after 1 hour
        let nextRefresh = Calendar.current.date(byAdding: .hour, value: 1, to: now)!
        let timeline = Timeline(entries: entries, policy: .after(nextRefresh))
        completion(timeline)
    }

    private func makeEntry(at date: Date = Date()) -> SimpleEntry {
        guard
            let data = loadPrayerData(),
            let target = parseISO(data.nextPrayerTime)
        else {
            return SimpleEntry(date: date, nextPrayerName: "—", countdown: "--:--:--")
        }

        // Calculate countdown from `date` (not necessarily now, for timeline)
        let diff = max(0, Int(target.timeIntervalSince(date)))
        let h = diff / 3600
        let m = (diff % 3600) / 60
        let s = diff % 60
        let cd = String(format: "%02d:%02d:%02d", h, m, s)

        return SimpleEntry(date: date, nextPrayerName: data.nextPrayerName, countdown: cd)
    }
}

// MARK: - Entry

struct SimpleEntry: TimelineEntry {
    let date: Date
    let nextPrayerName: String
    let countdown: String
}

// MARK: - Widget View

struct RamadanWidgetEntryView: View {
    var entry: Provider.Entry

    let primaryColor = Color(red: 0.373, green: 0.494, blue: 0.471)
    let accentColor  = Color(red: 0.984, green: 0.992, blue: 0.875)
    let textColor    = Color.white

    var body: some View {
        ZStack {
            primaryColor.ignoresSafeArea()

            VStack(alignment: .leading, spacing: 6) {
                Text("Time until \(entry.nextPrayerName)")
                    .font(.caption)
                    .foregroundColor(textColor.opacity(0.75))

                Text(entry.countdown)
                    .font(.system(size: 36, weight: .black, design: .default))
                    .foregroundColor(textColor)
                    .monospacedDigit()

                Spacer()

                Text("Ramadan Companion")
                    .font(.caption2)
                    .foregroundColor(textColor.opacity(0.45))
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

// MARK: - Widget

@main
struct RamadanWidget: Widget {
    let kind: String = "RamadanWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            RamadanWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Ramadan Companion")
        .description("Live countdown to your next prayer.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
