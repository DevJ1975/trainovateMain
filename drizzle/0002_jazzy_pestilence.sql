ALTER TABLE `corrective_actions` ADD `last_overdue_notified_at` text;--> statement-breakpoint
CREATE INDEX `idx_ca_due` ON `corrective_actions` (`status`,`due_at`);