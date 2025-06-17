import { useState } from 'react'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
  lastActive: string
  status: 'active' | 'inactive' | 'suspended'
  conversationCount: number
  totalMessages: number
}

export default function UsersManagement () {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@discutie.local',
      role: 'admin',
      createdAt: '2024-01-01',
      lastActive: '2024-01-17',
      status: 'active',
      conversationCount: 25,
      totalMessages: 342
    },
    {
      id: '2',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'user',
      createdAt: '2024-01-05',
      lastActive: '2024-01-16',
      status: 'active',
      conversationCount: 12,
      totalMessages: 156
    },
    {
      id: '3',
      username: 'jane_smith',
      email: 'jane@example.com',
      role: 'user',
      createdAt: '2024-01-10',
      lastActive: '2024-01-14',
      status: 'inactive',
      conversationCount: 8,
      totalMessages: 89
    },
    {
      id: '4',
      username: 'mike_wilson',
      email: 'mike@example.com',
      role: 'user',
      createdAt: '2024-01-12',
      lastActive: '2024-01-13',
      status: 'suspended',
      conversationCount: 3,
      totalMessages: 45
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleToggleUserStatus = (id: string) => {
    setUsers(prev =>
      prev.map(user => {
        if (user.id === id) {
          const newStatus = user.status === 'active' ? 'inactive'
            : user.status === 'inactive' ? 'active' : 'active'
          return { ...user, status: newStatus }
        }
        return user
      })
    )
  }

  const handleSuspendUser = (id: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' } : user
      )
    )
  }

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== id))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className='h-4 w-4 text-green-500' />
      case 'inactive':
        return <ClockIcon className='h-4 w-4 text-gray-400' />
      case 'suspended':
        return <XCircleIcon className='h-4 w-4 text-red-500' />
      default:
        return <ClockIcon className='h-4 w-4 text-gray-400' />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getRoleColor = (role: string) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }

  return (
    <div className='bg-white dark:bg-gray-800 shadow-sm rounded-lg'>
      <div className='px-6 py-5 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
          <div>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              Users Management
            </h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              Manage user accounts and permissions
            </p>
          </div>
          <button className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer'>
            <PlusIcon className='h-4 w-4 mr-2' />
            Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4'>
          {/* Search */}
          <div className='relative flex-1 max-w-md'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search users...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className='block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='all'>All Statuses</option>
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
            <option value='suspended'>Suspended</option>
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
            className='block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='all'>All Roles</option>
            <option value='admin'>Admin</option>
            <option value='user'>User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
          <thead className='bg-gray-50 dark:bg-gray-700'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                User
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Role
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Activity
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Usage
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
            {filteredUsers.map((user) => (
              <tr key={user.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10'>
                      <div className='h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center'>
                        <UserIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                      </div>
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900 dark:text-white'>
                        {user.username}
                      </div>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center space-x-2'>
                    {user.role === 'admin' && <ShieldCheckIcon className='h-4 w-4 text-purple-500' />}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center space-x-2'>
                    {getStatusIcon(user.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                  <div>
                    <div>Joined: {user.createdAt}</div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                      Last: {user.lastActive}
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white'>
                  <div>
                    <div>{user.conversationCount} conversations</div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                      {user.totalMessages} messages
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${
                        user.status === 'active'
                          ? 'text-red-600 hover:text-red-900 dark:text-red-400'
                          : 'text-green-600 hover:text-green-900 dark:text-green-400'
                      }`}
                      title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {user.status === 'active' ? (
                        <XCircleIcon className='h-4 w-4' />
                      ) : (
                        <CheckCircleIcon className='h-4 w-4' />
                      )}
                    </button>

                    {user.status !== 'suspended' && (
                      <button
                        onClick={() => handleSuspendUser(user.id)}
                        className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-orange-600 hover:text-orange-900 dark:text-orange-400 cursor-pointer'
                        title='Suspend'
                      >
                        <ClockIcon className='h-4 w-4' />
                      </button>
                    )}

                    {user.status === 'suspended' && (
                      <button
                        onClick={() => handleSuspendUser(user.id)}
                        className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-green-600 hover:text-green-900 dark:text-green-400 cursor-pointer'
                        title='Unsuspend'
                      >
                        <CheckCircleIcon className='h-4 w-4' />
                      </button>
                    )}

                    <button
                      className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-blue-600 hover:text-blue-900 dark:text-blue-400 cursor-pointer'
                      title='Edit'
                    >
                      <PencilIcon className='h-4 w-4' />
                    </button>

                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 hover:text-red-900 dark:text-red-400 cursor-pointer'
                        title='Delete'
                      >
                        <TrashIcon className='h-4 w-4' />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className='px-6 py-12 text-center'>
          <UserIcon className='mx-auto h-12 w-12 text-gray-400' />
          <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-white'>No users found</h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}
