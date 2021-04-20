import React from 'react';
import { Drawer } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebar, cart } = useSelector((state) => ({ ...state }));

  const imageStyle = {
    width: "100%",
    height: "50px",
    objectFit: "cover",
  };

  return (
    <Drawer
      className="text-center"
      title={`Cart / ${cart.length} Product`}
      placement="right"
      closable={false}
      onClose={() => {
        dispatch({
          type: "SET_SIDEBAR",
          payload: false,
        });
      }}
      visible={sidebar}
    >
      {cart.map((p) => (
        <div key={p._id} className="row">
          <div className="col">
            {p.images[0] && (
              <>
                <img src={p.images[0].url} style={imageStyle} />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}

      <Link to="/cart">
        <button
          onClick={() =>
            dispatch({
              type: "SET_SIDEBAR",
              payload: false,
            })
          }
          className="text-center btn btn-primary btn-raised btn-block"
        >
          Go To Cart
        </button>
      </Link>
    </Drawer>
  );
}

export default Sidebar
