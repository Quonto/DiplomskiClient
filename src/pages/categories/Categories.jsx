import { useState } from 'react';
import './categories.css'
import {Link} from 'react-router-dom'

const categories = [
    {label: 'tehnika', values: ['elektronika', 'audio', 'kucni aparati', 'TV', 'VCR']},
    {label: 'masine i alati', values: ['elektricne masine', 'kosacice i trimeri', 'elektricni alat', 'masinski alat', 'poljoprivreda']},
    {label: 'sportska oprema', values: ['kopacke', 'bicikli', 'dresovi']},
    {label: 'racunari i oprema', values: ['laptop i tablet', 'desktop racunari', 'monitori', 'mrezni uredjaji', 'zvucnici', 'web kamere']},
    {label: 'obuca', values: ['muska', 'zenska', 'ostalo']}
]

const Categories = () => {
    const [selectedCategory, setSelectedCategory] = useState(null)

    const handleChangeCategory = (selected) => {
        if(selected.label !== selectedCategory?.label)
            setSelectedCategory(selected)
        else setSelectedCategory(null)
    }

    if(!selectedCategory){
        return <section className="categories">
        {categories.map((category) => {
            const {label} = category; 
            return <>
            <header onClick={() => handleChangeCategory(category)} className="category-article">
                <img src="https://i0.wp.com/automotoshow.rs/wp-content/uploads/2022/06/audi-a3-sportback-45-tfsi-e-2021.jpg?fit=1920%2C1080&ssl=1" alt="" className="category-article-image" />
                <h4>{label}</h4>
            </header>
        </>
        })}                                             
    </section>
    }

    else{
        return <>
        <section className="categories">
        {categories.map((category) => {
            const {label, values} = category; 
            return <>
            {selectedCategory.label === label && <header onClick={() => handleChangeCategory(category)} className="category-article">
                <img src="https://i0.wp.com/automotoshow.rs/wp-content/uploads/2022/06/audi-a3-sportback-45-tfsi-e-2021.jpg?fit=1920%2C1080&ssl=1" alt="" className="category-article-image" />
                <h4>{label}</h4>
            </header>}
            {selectedCategory?.label === label && <>
                {values.map((subCategory, i) => {
                    return <Link key={i} to="/categories/category" className='category-article'>
                        <img src="https://i.gadgets360cdn.com/products/large/motorola-edge-30-pro-657x800-1645713862.jpg" alt="" className='subcategory-article-image'/>
                        {subCategory}
                    </Link>
                })}              
            </>}
        </>
        })}                                             
    </section>
    <section className="categories">
        {categories.map((category, index) => {
            if(category.label !== selectedCategory.label){
                return <header key={index} onClick={() => handleChangeCategory(category)} className="category-article">
                        <img src="https://i0.wp.com/automotoshow.rs/wp-content/uploads/2022/06/audi-a3-sportback-45-tfsi-e-2021.jpg?fit=1920%2C1080&ssl=1" alt="" className="category-article-image" />
                        <h4>{category.label}</h4>
            </header>
            }
            return null;
    })}
    </section>
    </>
    }
}
export default Categories;