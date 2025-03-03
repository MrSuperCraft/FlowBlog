## Type Safety

Ensure type safety when working with Supabase actions and functions when possible. Utilize types when needed, but don't check for everything as it could be very time-consuming.
Tl;dr Type safety is important when working with Supabase, just not that much that it will take a while to include it.


### How to Generate Types:

If not done already, insert the environment variables from .env.example and create your own .env file with provided environment variables from Supabase Project. [See Here](/.env.example)

Use the following command, and paste your project ID in the suitable spot as a plain value replacement:

```bash
npx supabase gen types typescript --project-id project-id-here --schema public > dbtypes.ts
```