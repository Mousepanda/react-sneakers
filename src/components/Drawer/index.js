import React from "react";
import axios from "axios";

import Info from "../Info";
import { useCart } from "../../hooks/useCart";

import styles from "./Drawer.module.scss"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Drawer({ onClose, items = [], onRemove, opened }) {
	const {cartItems, setCartItems, totalPrice} = useCart();
	const [orderId, setOrderId] = React.useState(null);
	const [isOrderComplete, setIsOrderComplete] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	const onClickOrder = async () => {
		try {
			setIsLoading(true);
			const {data} = await axios.post("https://64cb7fc9700d50e3c705ff63.mockapi.io/orders", {
				items: cartItems,
			});
			setOrderId(data.id);
			setIsOrderComplete(true);
			setCartItems([]);

			for (let index = 0; index < cartItems.length; index++) {
				const item = cartItems[index];
				axios.delete("https://64c26ce7eb7fd5d6ebcfd745.mockapi.io/cart/" + item.id);
				await delay(1000);
			}

		} catch (error) {
			alert('Ошибка при создании заказа :(');
		}
		setIsLoading(false);
	}


	return (
		<div className={`${styles.overlay} ${opened ? styles.overlayVisible : ''}`}>
			<div className={styles.drawer}>
				<h2 className="d-flex justify-between mb-30">Корзина
					<img onClick={onClose} className="cu-p" src="img/cart-active.svg" alt="Close" />
				</h2>

				{
					items.length > 0 ?
						<div className="d-flex flex-column flex">
							<div className="items">
								{
									items.map((obj) => (<div key={obj.id} className="cartItem d-flex align-center mb-20">
										<div style={{ backgroundImage: `url( ${obj.imageUrl} )` }} className="cartItemImg"></div>
										<div className="mr-20 flex">
											<p className="mb-5">{obj.title}</p>
											<b>{obj.price} руб.</b>
										</div>
										<img onClick={() => onRemove(obj.id)} className="removeBtn" src="img/cart-active.svg" alt="Remove" />
									</div>
									))}
							</div><div className="cartTotalBlock">
								<ul>
									<li>
										<span>Итого:</span>
										<div></div>
										<b>{totalPrice} руб. </b>
									</li>
									<li>
										<span>Налог 5%:</span>
										<div></div>
										<b>{totalPrice * 0.05} руб. </b>
									</li>
								</ul>
								<button disabled={isLoading} onClick={onClickOrder} className="greenButton">Оформить заказ<img src="img/arrow.svg" alt="arrow" /></button>
							</div>
						</div>
						: (
							<Info 
							title={isOrderComplete ? "Заказ оформлен!" : "Корзина пустая"}
							description={isOrderComplete ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке.` : "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."}
							image={isOrderComplete ? "img/cart-order.jpg" : "img/empty-cart.jpg"}/>
						)}
			</div>
		</div>
	);
}

export default Drawer;