import './home.css'

const Home = () => {
    return <main className="home">
        {/* Most wanted products*/}
        <section className="wanted">
        <h3>Najtrazeniji predmeti</h3>
        <div className="wanted-list">
            {/* list of products */}
            <article className="wanted-article">
                <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                <div className="wanted-info">
                    <h4>9.200 RSD</h4>
                    <p>121 ponuda</p>
                </div>
            </article>
            <article className="wanted-article">
                <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                <div className="wanted-info">
                    <h4>9.200 RSD</h4>
                    <p>121 ponuda</p>
                </div>
            </article>
            <article className="wanted-article">
                <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                <div className="wanted-info">
                    <h4>9.200 RSD</h4>
                    <p>121 ponuda</p>
                </div>
            </article>
            <article className="wanted-article">
                <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                <div className="wanted-info">
                    <h4>9.200 RSD</h4>
                    <p>121 ponuda</p>
                </div>
            </article>
            <article className="wanted-article">
                <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                <div className="wanted-info">
                    <h4>9.200 RSD</h4>
                    <p>121 ponuda</p>
                </div>
            </article>
            <article className="wanted-article">
                <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                <div className="wanted-info">
                    <h4>9.200 RSD</h4>
                    <p>121 ponuda</p>
                </div>
            </article>
        </div>
        </section>
        {/* Most newest products */}
        <section className="wanted">
            <h3>Istaknuti predmeti</h3>
            {/* List of products */}
            <div className="wanted-list">                               
                <article className="wanted-article">
                    <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                    <h4 className="wanted-price">450 RSD</h4>
                </article>                 
                <article className="wanted-article">
                    <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                    <h4 className="wanted-price">450 RSD</h4>
                </article>                 
                <article className="wanted-article">
                    <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                    <h4 className="wanted-price">450 RSD</h4>
                </article>                 
                <article className="wanted-article">
                    <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                    <h4 className="wanted-price">450 RSD</h4>
                </article>                 
                <article className="wanted-article">
                    <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                    <h4 className="wanted-price">450 RSD</h4>
                </article>                 
                <article className="wanted-article">
                    <img className="wanted-image" src="https://static.limundoslike.com/geforce-gtx-750-ti-2gb_slika_L_324699421.jpg?1656921495" alt="" />
                    <h4 className="wanted-price">450 RSD</h4>
                </article>                 
            </div>
        </section>
        {/*Categories */}
        <section className="popular-categories">
            <h3>Popularne kategorije</h3>
            <div className="popular-categories-list">
                <article className="popular-category">
                    <div className="popular-image-wrapper">
                        <img className="popular-category-image" src="https://bibliotekamuzejodzaci.org.rs/wp-content/uploads/2016/11/Wallpapers-Old-Books-The-Old-Books-Wallpaper-1020x816-iWallH-copy.jpg" alt="" />
                    </div>
                    <p>Knjige</p>
                </article>
                <article className="popular-category">
                    <div className="popular-image-wrapper">
                        <img className="popular-category-image" src="https://bibliotekamuzejodzaci.org.rs/wp-content/uploads/2016/11/Wallpapers-Old-Books-The-Old-Books-Wallpaper-1020x816-iWallH-copy.jpg" alt="" />
                    </div>
                    <p>Knjige</p>
                </article>
                <article className="popular-category">
                    <div className="popular-image-wrapper">
                        <img className="popular-category-image" src="https://bibliotekamuzejodzaci.org.rs/wp-content/uploads/2016/11/Wallpapers-Old-Books-The-Old-Books-Wallpaper-1020x816-iWallH-copy.jpg" alt="" />
                    </div>
                    <p>Knjige</p>
                </article>
                <article className="popular-category">
                    <div className="popular-image-wrapper">
                        <img className="popular-category-image" src="https://bibliotekamuzejodzaci.org.rs/wp-content/uploads/2016/11/Wallpapers-Old-Books-The-Old-Books-Wallpaper-1020x816-iWallH-copy.jpg" alt="" />
                    </div>
                    <p>Knjige</p>
                </article>
            </div>
        </section>
    </main>
}

export default Home;