import { graphql } from "msw";

export const api = graphql.link(import.meta.env.VITE_BACKEND_URL);
