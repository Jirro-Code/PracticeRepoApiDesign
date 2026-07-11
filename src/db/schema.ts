import { mysqlTable, varchar, text, timestamp, boolean, int} from "drizzle-orm/mysql-core";
import { v4 as uuid } from "uuid";
import {relations} from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = mysqlTable("users", {
    id: varchar("id", {length: 36}).primaryKey(),
    username: varchar("username", {length: 255}).notNull().unique(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 255}).notNull(),
    firstName: varchar("first_name", {length: 255}).notNull(),
    lastName: varchar("last_name", {length: 255}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const habits = mysqlTable("habits", {
    id: varchar("id", {length: 36}).primaryKey(),
    userId: varchar("user_id", {length: 36}).references(() => users.id, {
        onDelete: "cascade",
    }).notNull(),
    name: varchar("name", {length: 255}).notNull(),
    description: text("description"),
    frequency: varchar("frequency", {length: 255}).notNull(),
    targetCount: int("target_count").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const entries = mysqlTable("entries", {
    id: varchar("id", {length: 36}).primaryKey(),
    habitId: varchar("habit_id", {length: 36}).references(() => habits.id, {
        onDelete: "cascade",
    }).notNull(),
    completionDate: timestamp("completion_date").defaultNow().notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const tags = mysqlTable("tags", {
    id: varchar("id", {length: 36}).primaryKey(),
    name: varchar("name", {length: 255}).notNull().unique(),
    color: varchar("color", {length: 7}).default("#9e8b8b"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const habitTags = mysqlTable("habit_tags", {
    id: varchar("id", {length: 36}).primaryKey(),
    habitId: varchar("habit_id", {length: 36}).references(() => habits.id, {
        onDelete: "cascade",
    }).notNull(),
    tagId: varchar("tag_id", {length: 36}).references(() => tags.id, {
        onDelete: "cascade",
    }).notNull(),
});

export const userRelations = relations(users, ({many}) => ({
    habits: many(habits),
}));

export const habitsRelations = relations(habits, ({one, many}) => ({
    user: one(users, {
        //declares which primary key in the users table is referenced by the foreign key in the habits table
        fields: [habits.userId],
        //foreign key
        references: [users.id], 
    }),
    entries: many(entries),
    habitTags: many(habitTags),
}));

export const entriesRelations = relations(entries, ({one}) => ({
    habit: one(habits, {
        fields: [entries.habitId],
        references: [habits.id],
    }),
}));

export const tagsRelations = relations(tags, ({many}) => ({
    habitTags: many(habitTags),
}));

export const habitTagsRelations = relations(habitTags, ({one}) => ({
    habit: one(habits, {
        fields: [habitTags.habitId],
        references: [habits.id],
    }),
    tag: one(tags, {
        fields: [habitTags.tagId],
        references: [tags.id],
    }),
}));

export type User = typeof users.$inferSelect;
export type Habit = typeof habits.$inferSelect;
export type Entry = typeof entries.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type HabitTag = typeof habitTags.$inferSelect;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);