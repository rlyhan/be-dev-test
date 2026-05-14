import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'

vi.mock('@/lib/prisma', () => ({
    prisma: {
        customer: {
            findMany: vi.fn(),
            count: vi.fn(),
        },
    },
}))

import { prisma } from '@/lib/prisma'

const mockCustomer = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    gender: 'Male',
    ipAddress: '1.2.3.4',
    company: 'Test Company',
    city: 'Auckland',
    title: 'Software Developer',
    website: 'https://acme.com',
}

function makeRequest(qs: string) {
    return new Request(`http://localhost/api/customers${qs}`)
}

describe('GET /api/customers', () => {
    beforeEach(() => {
        vi.mocked(prisma.customer.findMany).mockResolvedValue([mockCustomer])
        vi.mocked(prisma.customer.count).mockResolvedValue(1)
    })

    it('returns customers with pagination metadata', async () => {
        const res = await GET(makeRequest(''))
        const body = await res.json()

        expect(body.customers).toEqual([mockCustomer])
        expect(body.page).toBe(1)
        expect(body.pageSize).toBe(25)
        expect(body.total).toBe(1)
        expect(body.totalPages).toBe(1)
    })

    it('skips correctly for page 2', async () => {
        vi.mocked(prisma.customer.count).mockResolvedValue(50)
        await GET(makeRequest('?page=2'))

        expect(prisma.customer.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ skip: 25, take: 25 })
        )
    })

    it('defaults to page 1 for non-numeric input', async () => {
        await GET(makeRequest('?page=abc'))

        expect(prisma.customer.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ skip: 0 })
        )
    })

    it('defaults to page 1 for negative input', async () => {
        await GET(makeRequest('?page=-5'))

        expect(prisma.customer.findMany).toHaveBeenCalledWith(
            expect.objectContaining({ skip: 0 })
        )
    })
})
