export function parseCustomers(rows: Record<string, string>[]) {
    return rows.map((row, i) => {
        const id = parseInt(row.id, 10)
        if (isNaN(id)) throw new Error(`Row ${i + 1}: invalid id "${row.id}"`)
        return {
            id,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            gender: row.gender,
            ipAddress: row.ip_address,
            company: row.company,
            city: row.city,
            title: row.title,
            website: row.website,
        }
    })
}
