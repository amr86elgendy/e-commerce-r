import React, { useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";

const RatingModal = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const user = useSelector(state => state.user);
  const history = useHistory();
  const { slug } = useParams();

  const handleModal = () => {
    if(user && user.token) {
      setShowModal(true)
    } else {
      history.push({
        pathname: '/login',
        state: { from: `/product/${slug}` },
      })
    }
  }

  return (
    <>
      <div onClick={handleModal}>
        <StarOutlined className="text-danger" /> <br />{" "}
        {user ? "Leave rating" : "Login to leave rating"}
      </div>
      <Modal
        title="Leave your rating"
        centered
        visible={showModal}
        onOk={() => {
          setShowModal(false);
          toast.success("Thanks for your review. It will apper soon");
        }}
        onCancel={() => setShowModal(false)}
      >
        {children}
      </Modal>
    </>
  )
}

export default RatingModal
