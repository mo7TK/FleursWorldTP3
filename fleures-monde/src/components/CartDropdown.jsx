import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../services/cartSlice";
import { useNavigate } from "react-router-dom";

function CartDropdown() {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (bouquetId) => {
    dispatch(removeFromCart(bouquetId));
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate("/panier");
    }
  };

  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle text-white position-relative"
        href="#"
        id="cartDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        🛒 Panier
        {items.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
            {items.length}
          </span>
        )}
      </a>
      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="cartDropdown" style={{ minWidth: "350px" }}>
        {items.length === 0 ? (
          <li className="dropdown-item text-muted">Votre panier est vide</li>
        ) : (
          <>
            <li className="dropdown-header">
              <strong>Mon Panier ({items.length} article{items.length > 1 ? 's' : ''})</strong>
            </li>
            <li><hr className="dropdown-divider" /></li>
            
            {items.map((item) => (
              <li key={item.bouquet.id} className="dropdown-item d-flex justify-content-between align-items-start p-2">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center">
                    <img 
                      src={item.bouquet.image} 
                      alt={item.bouquet.nom}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      className="rounded me-2"
                    />
                    <div>
                      <div className="fw-bold">{item.bouquet.nom}</div>
                      <small className="text-muted">
                        {item.quantite} x {item.bouquet.prix} DZD
                      </small>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.bouquet.id);
                  }}
                  title="Supprimer"
                >
                  ✕
                </button>
              </li>
            ))}
            
            <li><hr className="dropdown-divider" /></li>
            
            <li className="dropdown-item">
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>{total.toFixed(2)} DZD</span>
              </div>
            </li>
            
            <li className="dropdown-item p-2">
              <button 
                className="btn btn-success w-100 mb-2"
                onClick={handleCheckout}
              >
                Voir le panier
              </button>
              <button 
                className="btn btn-outline-danger w-100 btn-sm"
                onClick={() => dispatch(clearCart())}
              >
                Vider le panier
              </button>
            </li>
          </>
        )}
      </ul>
    </li>
  );
}

export default CartDropdown;