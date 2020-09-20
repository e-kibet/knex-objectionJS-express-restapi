const { Model } = require('objection');
const Knex = require('knex');

const knex = Knex({
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
        host: '127.0.0.1',
        user: 'dev',
        password: 'dev',
        database: 'test.knex.db'
    }
});

Model.knex(knex);

class Person extends Model {
    static get tableName() {
        return 'persons';
    }

    static get relationMappings() {
        return {
            children: {
                relation: Model.HasManyRelation,
                modelClass: Person,
                join: {
                    from: 'persons.id',
                    to: 'persons.parentId'
                }
            }
        };
    }
}

async function createSchema() {
    if (await knex.schema.hasTable('persons')) {
        return;
    }
    await knex.schema.createTable('persons', table => {
        table.increments('id').primary();
        table.integer('parentId').references('persons.id');
        table.string('firstName');
    });
}

async function main() {
    const sylvester = await Person.query().insertGraph({
        firstName: 'Sylvester',
        children: [
            {
                firstName: 'Sage'
            },
            {
                firstName: 'Sophia'
            }
        ]
    });

    console.log('created:', sylvester);
    const sylvesters = await Person.query()
        .where('firstName', 'Sylvester')
        .withGraphFetched('children')
        .orderBy('id');
    console.log('sylvesters:', sylvesters);
}

createSchema()
    .then(() => main())
    .then(() => knex.destroy())
    .catch(err => {
        console.error(err);
        return knex.destroy();
    });