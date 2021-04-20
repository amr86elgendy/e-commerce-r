import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/layout/AdminNav'
import OrdersTable from '../../components/admin/OrdersTable'
import { getOrders, changeStatus } from '../../functions/admin'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const user = useSelector((state) => state.user)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () =>
    getOrders(user.token).then((res) => {
      setOrders(res.data)
    })

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token).then((res) => {
      toast.success('Status updated')
      loadOrders()
    })
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>

        <div className='col-md-10'>
          <h4>Admin Dashboard</h4>
          <OrdersTable
            orders={orders}
            handleStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
