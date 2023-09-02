import { emptyDir } from "https://deno.land/std@0.182.0/fs/empty_dir.ts";

/* Empty the npm directory */
await emptyDir('./npm');

// ...