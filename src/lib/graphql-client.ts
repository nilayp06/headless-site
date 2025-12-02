import { GraphQLClient } from 'graphql-request'

// 👉 Update to your local WordPress GraphQL endpoint:
const endpoint = 'https://headlesswp.dev.brainbean.us/graphql'

export const client = new GraphQLClient(endpoint)
