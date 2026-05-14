import 'dotenv/config'
import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../lib/prisma'
import { parseCustomers } from '../lib/parse-customers'

/*
 * Seeding script for populating the database with initial customer data
 * WARNING: This will delete all existing customers before seeding new data
 */
async function main() {
    const rows = parse(readFileSync(join(process.cwd(), '../data/customers.csv'), 'utf-8'), {
        columns: true,
        skip_empty_lines: true,
    })

    const customers = parseCustomers(rows)

    await prisma.$transaction([
        prisma.customer.deleteMany(),
        prisma.customer.createMany({ data: customers }),
    ])

    console.log(`Seeded ${customers.length} customers`)
}

main().finally(() => prisma.$disconnect())
