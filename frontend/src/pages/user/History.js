import React, { useEffect, useState } from 'react'
import UserNav from '../../components/layout/UserNav'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import { getUserOrders } from '../../functions/order'
import PaymentInfo from '../../components/user/PaymentInfo'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Invoice from '../../components/user/Invoice'

const History = () => {
  const [orders, setOrders] = useState([])
  const user = useSelector((state) => state.user)

  useEffect(() => {
    loadUserOrders()
  }, [])

  const loadUserOrders = () =>
    getUserOrders(user.token).then(({ data }) => {
      console.log(data)
      setOrders(data)
    })

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <UserNav />
        </div>
        <div className='col text-center'>
          <h4>
            {orders.length > 0 ? 'User purchase orders' : 'No purchase orders'}
          </h4>
          {orders.reverse().map((order, i) => (
            <div key={i} className='m-5 p-3 card'>
              <PaymentInfo order={order} />
              <table className='table table-bordered'>
                <thead className='thead-light'>
                  <tr>
                    <th scope='col'>Title</th>
                    <th scope='col'>Price</th>
                    <th scope='col'>Brand</th>
                    <th scope='col'>Color</th>
                    <th scope='col'>Count</th>
                    <th scope='col'>Shipping</th>
                  </tr>
                </thead>

                <tbody>
                  {order.products.map((p, i) => (
                    <tr key={i}>
                      <td>
                        <b>{p.product.title}</b>
                      </td>
                      <td>{p.product.price}</td>
                      <td>{p.product.brand}</td>
                      <td>{p.color}</td>
                      <td>{p.count}</td>
                      <td>
                        {p.product.shipping === 'Yes' ? (
                          <CheckCircleOutlined style={{ color: 'green' }} />
                        ) : (
                          <CloseCircleOutlined style={{ color: 'red' }} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className='row'>
                <div className='col'>
                  <PDFDownloadLink
                    document={<Invoice order={order} />}
                    fileName='invoice.pdf'
                    className='btn btn-sm btn-block btn-outline-primary'
                  >
                    Download PDF
                  </PDFDownloadLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default History
