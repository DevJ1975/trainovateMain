CREATE TABLE `contributing_factors` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`type` text NOT NULL,
	`note` text NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `near_miss_reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_cf_report` ON `contributing_factors` (`report_id`);--> statement-breakpoint
CREATE TABLE `corrective_actions` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`description` text NOT NULL,
	`owner_name` text NOT NULL,
	`due_at` text,
	`status` text NOT NULL,
	`completed_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `near_miss_reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_ca_report` ON `corrective_actions` (`report_id`);--> statement-breakpoint
CREATE TABLE `near_miss_meta` (
	`key` text PRIMARY KEY NOT NULL,
	`value` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `near_miss_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`org_id` text NOT NULL,
	`site_id` text NOT NULL,
	`reporter_name` text,
	`receipt_code` text,
	`anonymous` integer NOT NULL,
	`occurred_at` text NOT NULL,
	`reported_at` text NOT NULL,
	`location_text` text NOT NULL,
	`hazard_category` text NOT NULL,
	`description` text NOT NULL,
	`severity_potential` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `near_miss_reports_reference_unique` ON `near_miss_reports` (`reference`);--> statement-breakpoint
CREATE INDEX `idx_nmr_org_status` ON `near_miss_reports` (`org_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_nmr_receipt_code` ON `near_miss_reports` (`receipt_code`);--> statement-breakpoint
CREATE INDEX `idx_nmr_created_at` ON `near_miss_reports` (`created_at`);--> statement-breakpoint
CREATE TABLE `report_events` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`kind` text NOT NULL,
	`actor_name` text NOT NULL,
	`at` text NOT NULL,
	`payload` text,
	FOREIGN KEY (`report_id`) REFERENCES `near_miss_reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_re_report_at` ON `report_events` (`report_id`,`at`);