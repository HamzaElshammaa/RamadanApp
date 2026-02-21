import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), countdownText: "2 Hours Until Maghrib")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), countdownText: "2 Hours Until Maghrib")
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, countdownText: "2 Hours Until Maghrib")
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let countdownText: String
}

struct Ramadan_WidgetEntryView : View {
    var entry: Provider.Entry
    
    // We parse the exact custom hex codes here to map to native SwiftUI colors
    let primaryColor = Color(red: 0x5f / 255.0, green: 0x7e / 255.0, blue: 0x78 / 255.0)
    let accentColor = Color(red: 0xfb / 255.0, green: 0xfd / 255.0, blue: 0xdf / 255.0)

    var body: some View {
        ZStack {
            primaryColor.ignoresSafeArea()
            
            VStack(spacing: 8) {
                Text("Next Prayer")
                    .font(.headline)
                    .foregroundColor(accentColor)
                
                Text(entry.countdownText)
                    .font(.title2)
                    .bold()
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
            }
            .padding()
        }
    }
}

@main
struct Ramadan_Widget: Widget {
    let kind: String = "Ramadan_Widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            Ramadan_WidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Next Prayer")
        .description("Shows the countdown to the next prayer.")
        .supportedFamilies([.systemMedium])
    }
}
