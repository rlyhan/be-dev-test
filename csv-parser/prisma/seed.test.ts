import { describe, it, expect } from 'vitest'
import { parseCustomers } from '../lib/parse-customers'

const validRow = {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    gender: 'Male',
    ip_address: '192.168.1.1',
    company: 'Acme',
    city: 'New York',
    title: 'Engineer',
    website: 'https://example.com',
}

describe('parseCustomers', () => {
    it('maps a valid row to the correct shape', () => {
        const [result] = parseCustomers([validRow])
        expect(result).toEqual({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            gender: 'Male',
            ipAddress: '192.168.1.1',
            company: 'Acme',
            city: 'New York',
            title: 'Engineer',
            website: 'https://example.com',
        })
    })

    it('returns an empty array for empty input', () => {
        expect(parseCustomers([])).toEqual([])
    })

    it('throws on a non-numeric id', () => {
        expect(() => parseCustomers([{ ...validRow, id: 'abc' }]))
            .toThrow('Row 1: invalid id "abc"')
    })

    it('throws when the id column is missing', () => {
        const { id: _id, ...rest } = validRow
        expect(() => parseCustomers([rest as Record<string, string>]))
            .toThrow('Row 1: invalid id "undefined"')
    })

    it('includes the correct row number in the error for the failing row', () => {
        const rows = [validRow, { ...validRow, id: 'bad' }]
        expect(() => parseCustomers(rows)).toThrow('Row 2:')
    })
})
