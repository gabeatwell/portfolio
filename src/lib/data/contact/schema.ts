import * as v from 'valibot';

export const contactSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
    email: v.pipe(v.string(), v.email('Valid email required')),
    message: v.pipe(v.string(), v.minLength(1, 'Please add a bit more detail')),
    _gotcha: v.optional(v.string()), // honeypot
    ts: v.optional(v.string()),
});

export const hireSchema = v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
    email: v.pipe(v.string(), v.email('Valid email required')),
    location: v.pipe(v.string(), v.minLength(1, 'Location is required')),
    site: v.optional(v.string()), // current "Website" field name
    company: v.optional(v.string()),
    project_type: v.pipe(
        v.string(),
        v.minLength(1, 'Project type is required'),
    ),
    new_project: v.pipe(v.string(), v.minLength(1, 'Required')),
    timeline: v.pipe(v.string(), v.minLength(1, 'Timeline is required')),
    budget: v.pipe(v.string(), v.minLength(1, 'Budget is required')),
    message: v.pipe(
        v.string(),
        v.minLength(10, 'Please add a bit more detail'),
    ),
    _gotcha: v.optional(v.string()), // honeypot
    ts: v.optional(v.string()),
});
