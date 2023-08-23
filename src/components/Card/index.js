import React from "react";
import styles from './Card.module.scss'
import ContentLoader from "react-content-loader"
import { AppContext } from "../../App";

function Card({ id,
	title,
	imageUrl,
	price,
	onClickFavorite,
	onPlus,
	favorite = false,
	added = false,
	loading = false
}) {
	
	const { isItemAdded } = React.useContext(AppContext);
	const [isFavorite, setIsFavorite] = React.useState(favorite);

	console.log(title)

	const onClickPlus = () => {
		onPlus({ id, title, imageUrl, price });
	}

	const onFavorite = () => {
		onClickFavorite({ id, title, imageUrl, price });
		setIsFavorite(!isFavorite);
	}

	return (
		<div className={styles.card}>
			{
				loading ? <ContentLoader
					speed={2}
					width={150}
					height={220}
					viewBox="0 0 150 220"
					backgroundColor="#f3f3f3"
					foregroundColor="#ecebeb">
					<rect x="0" y="0" rx="10" ry="10" width="150" height="105" />
					<rect x="0" y="127" rx="3" ry="3" width="150" height="15" />
					<rect x="0" y="152" rx="3" ry="3" width="93" height="15" />
					<rect x="0" y="195" rx="8" ry="8" width="80" height="24" />
					<rect x="115" y="187" rx="8" ry="8" width="32" height="32" />
				</ContentLoader>
					: <>
						<div className={styles.favorite} onClick={onFavorite}>
							<img src={isFavorite ? "/img/heart-liked.svg" : "/img/heart-unliked.svg"} alt='Favorite' />
						</div>
						<img width={133} height={112} src={imageUrl} alt="Sneakers" />
						<h5>{title}</h5>
						<div className="d-flex justify-between align-center">
							<div className="d-flex flex-column">
								<span>Цена:</span>
								<b>{price} руб.</b>
							</div>
							<img className={styles.plus} onClick={onClickPlus} src={isItemAdded(id) ? "/img/btn-checked.svg" : "/img/plus.svg"} alt="add" />
						</div>
					</>
			}
		</div>

	);
}

export default Card;