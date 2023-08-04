import React from "react";
import styles from './Card.module.scss'

function Card({ id, title, imageUrl, price, onClickFavorite, onPlus, favorite = false }) {
	const [isAdded, setIsAdded] = React.useState(false);
	const [isFavorite, setIsFavorite] = React.useState(favorite);


	const onClickPlus = () => {
		onPlus({ title, imageUrl, price });
		setIsAdded(!isAdded);
	}

	const onFavorite = () => {
		onClickFavorite({ id, title, imageUrl, price });
		setIsFavorite(!isFavorite);
	}

	return (
		<div className={styles.card}>
			<div className={styles.favorite} onClick={onFavorite}>
				<img src={isFavorite ? "/img/heart-liked.svg" : "/img/heart-unliked.svg"} alt='Favorite'/>
			</div>
			<img width={133} height={112} src={imageUrl} alt="Sneakers" />
			<h5>{title}</h5>
			<div className="d-flex justify-between align-center">
				<div className="d-flex flex-column">
					<span>Цена:</span>
					<b>{price} руб.</b>
				</div>
				<img className={styles.plus} onClick={onClickPlus} src={isAdded ? "/img/btn-checked.svg" : "/img/plus.svg"} alt="add" />
			</div>
		</div>

	);
}

export default Card;