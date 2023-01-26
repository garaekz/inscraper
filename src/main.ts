import { createClient } from "./client";

(async () => {
  const client = await createClient('AQEDAUDAhFQBXReNAAABhepyPCcAAAGGDn7AJ00Ags3ANlPtBc_27cEsz-6D2rPMwvhWhfaJDP9GrpcrE4KXWCQnc7mByPBj-Fwl2iGVn4e9nd2AqYgxlqR98odmvLDOutaU1d8dIwk5I3OZdzPbNZwQ');
  console.log(await client.getProfile('carlosazaustre'));
})();

