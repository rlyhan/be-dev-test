import { prisma } from '@/lib/prisma'

const PAGE_SIZE = 25

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const rawPage = parseInt(searchParams.get("page") ?? "1", 10)
    const page = Math.max(1, isNaN(rawPage) ? 1 : rawPage)

    const [customers, total] = await Promise.all([
        prisma.customer.findMany({
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.customer.count(),
    ])

    return Response.json({
        customers,
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
    })
}
