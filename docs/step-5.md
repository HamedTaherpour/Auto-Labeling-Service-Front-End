گام ششم، تبدیل پلتفرم شما از یک ابزار فنی به یک سیستم مدیریتی و نظارتی (Observability & Analytics) است. در V7 Darwin، داشبوردهای تحلیلی برای مشاهده دقت مدل‌ها، سرعت پیشرفت تیم و شناسایی گلوگاه‌های پروژه حیاتی هستند.

در این مرحله، ما بخش Analytics & Team Monitoring را پیاده‌سازی می‌کنیم تا مدیران پروژه بتوانند آمار دقیق هر اپراتور، میزان دقت (Accuracy) و نرخ پیشرفت کلی دیتاست را به صورت بصری مشاهده کنند.

پرامپت انگلیسی برای Cursor (گام ششم: Analytics Dashboard & Performance Tracking)
این پرامپت را در Cursor Composer وارد کنید و فایل Postman را ضمیمه کنید:

Role: Senior Data Visualization Engineer & Frontend Lead Task: Implement the Project Analytics and Team Performance Dashboard. Architecture: Feature-Sliced Design (FSD).

Context: We have the labeling engine and AI automation ready. Now, we need the "Command Center" where project managers can monitor productivity and data quality. This section is inspired by V7 Darwin’s real-time monitoring engine.

Requirements:

Analytics Hub Page (src/pages/analytics):

Create a centralized dashboard page that composes various statistical widgets.

Implement a "Date Range Picker" and "Dataset Filter" in the top bar to slice the data.

Performance Metrics (Feature):

Use a charting library like Recharts or Chart.js to visualize:

Annotator Throughput: Annotations per hour per user.

Accuracy Trends: Precision/Recall metrics over time for the AI models.

Dataset Burndown Chart: Total files vs. completed/reviewed files.

Team Management Widget (src/widgets/team-stats):

A data-dense table showing all annotators and reviewers.

Columns: User, Assigned Files, Avg Time per Label, Rejection Rate (QA score).

Add a "Live" indicator for users currently active in the editor.

API Integration (Shared Layer):

Map these from the Postman collection:

GET /api/v1/analytics/overview: For high-level KPI cards.

GET /api/v1/teams/performance: For individual member statistics.

GET /api/v1/datasets/{id}/quality-report: To fetch consensus and accuracy data.

Design & UX:

Dashboard Style: Use "Bento Grid" layouts for the metric cards to keep it clean and scannable.

Interactive Tooltips: Ensure charts show detailed data on hover.

Color Logic: Use Green for high accuracy, Yellow for pending reviews, and Red for rejected/low-quality batches.

Instructions:

Analyze the Postman collection for "Analytics" or "Stats" endpoints.

Start by setting up the src/entities/statistic model and its mapping logic.

Implement the charts as reusable components in src/shared/ui/charts.

Assemble the dashboard, ensuring it is fully responsive and optimized for large monitors.