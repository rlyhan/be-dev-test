'use client'

import { useEffect, useState, useCallback } from 'react'

type Customer = {
  id: number
  firstName: string
  lastName: string
  email: string
  gender: string
  ipAddress: string
  company: string
  city: string
  title: string
  website: string
}

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/customers?page=${page}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setCustomers(data.customers)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch {
      setError('Failed to load customers. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col w-full max-w-7xl mx-auto py-16 px-8">
        <h1 className="text-xl font-semibold mb-6 dark:text-white">Customers</h1>

        {loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
            Loading...
          </p>
        )}
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && customers.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">No data imported.</p>
        )}

        {!loading && !error && customers.length > 0 && (
          <>
            <table className="table-fixed w-full text-sm">
              <caption className="sr-only">{total} customers</caption>
              <thead>
                <tr className="divide-x divide-gray-200 border-b border-gray-200 h-8">
                  <th scope="col" className="text-left truncate px-3">ID</th>
                  <th scope="col" className="text-left truncate px-3">First Name</th>
                  <th scope="col" className="text-left truncate px-3">Last Name</th>
                  <th scope="col" className="text-left truncate px-3">Email</th>
                  <th scope="col" className="text-left truncate px-3">Gender</th>
                  <th scope="col" className="text-left truncate px-3">IP Address</th>
                  <th scope="col" className="text-left truncate px-3">Company</th>
                  <th scope="col" className="text-left truncate px-3">City</th>
                  <th scope="col" className="text-left truncate px-3">Title</th>
                  <th scope="col" className="text-left truncate px-3">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="h-8 divide-x divide-gray-200">
                    <td className="truncate px-3">{customer.id}</td>
                    <td className="truncate px-3">{customer.firstName}</td>
                    <td className="truncate px-3">{customer.lastName}</td>
                    <td className="truncate px-3">{customer.email}</td>
                    <td className="truncate px-3">{customer.gender}</td>
                    <td className="truncate px-3">{customer.ipAddress}</td>
                    <td className="truncate px-3">{customer.company}</td>
                    <td className="truncate px-3">{customer.city}</td>
                    <td className="truncate px-3">{customer.title}</td>
                    <td className="truncate px-3">{customer.website}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-4">
              <div className="ml-auto flex items-center gap-3" role="navigation" aria-label="Pagination">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={loading || page <= 1}
                  className="cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40 dark:border-zinc-600 dark:text-white"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading || page >= totalPages}
                  className="cursor-pointer px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40 dark:border-zinc-600 dark:text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
