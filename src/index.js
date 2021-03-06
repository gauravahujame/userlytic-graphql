const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    questions(parent, { id }, ctx, info) {
      return ctx.db.query.questions({ where: { id } }, info);
    }
  },
  Mutation: {
    createQuestion(parent, { title, type, options }, ctx, info) {
      return ctx.db.mutation.createQuestion(
        {
          data: {
            title,
            type,
            options: {
              create: [ ...options ]
            },
          },
        },
        info,
      )
    },
    createResponse(parent, { questionId }, ctx, info) {
      return ctx.db.mutation.createResponse(
        {
          data: {
            questionId,
          },
        },
        info,
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
      endpoint: 'https://eu1.prisma.sh/public-honeywizard-490/userlytic-graphql/dev', // the endpoint of the Prisma API
      debug: true, // log all GraphQL queries & mutations sent to the Prisma API
      // secret: 'mysecret123', // only needed if specified in `database/prisma.yml`
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
