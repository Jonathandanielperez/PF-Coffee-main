import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllDiets, postProduct, getAllProviders, getAllCategories } from "../../../redux/actions"; //2
import { useNavigate } from 'react-router-dom';

import 'react-datepicker/dist/react-datepicker.css';
import "bootstrap/dist/css/bootstrap.min.css";
import style from '../../../styles/Admin/ProductCreate.module.css';

var testImage = /(https?:\/\/.*\.(?:png|jpg))/;
var testName = /^[A-Z][a-z][^$()!¡@#/=¿{}?*%&|<>#]*$/;
var testDescription = /^[A-Za-z]+$/i;
// var testNumber = /^\d{1,2}$/;


function validate(input) {

  let errors = {};
  /** TITLE   */
  if (!input.title) errors.title = 'Enter product name';
  if (!testName.test(input.title)) errors.title = 'Start the name with capital letter. Only characters "":.,_- are accepted';
  if (100 <= [input.title].length) errors.title = 'Not exceed 100 characters';
  /** Cost */
  if (!input.cost) errors.cost = 'Enter a cost from provider';
  /** Margin */
  if (!input.margin) errors.margin = 'Enter a margin of the product';
  /** Price */
  if (!input.price) errors.price = 'Enter a price of the product';

  /** description */
  if (!input.description) errors.description = 'Enter a description of the product';
  /** IMAGE */
  if (!testImage.test(input.image)) errors.image = `Enter the URL of a representative image in jpg or png format`;
  /** stock */
  if (!input.stock) errors.stock = `Enter a number of product`;
  /** Diet */
  if (![input.diet].length) errors.diet = 'Choose at least one type of diet';

  return errors;
}

export default function FormProduct() {
  const dispatch = useDispatch();
  var diet = useSelector((state) => state.diets);
  var provider = useSelector((state) => state.providers);
  var categories = useSelector((state) => state.categories);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllDiets())
    dispatch(getAllProviders())
    dispatch(getAllCategories())
  }, [dispatch])

  const [input, setInput] = useState({
        title: '',
        cost: '',
        margin: '',
        price: '',
        description: '',
        image: '',
        // disable: false,
        like: '',
        stock: '',
        diets: [],
        providers: [],
        categories: []
  });
  var suggested = (Math.round(((input?.cost) * (((input?.margin) / 100) + 1))));
  function handleInputChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
    setErrors(validate({
      ...input,
      [e.target.name]: e.target.value
    }));
  };
  async function handleSubmit(e) {
    e.preventDefault();
    if (Object.values(errors).length > 0) {
      alert("Please fill in all the fields")
      // console.log('handleSubmit ', { errors });
    }
    else {
      console.log('handleSubmit ', { input });
      dispatch(postProduct(input));
      alert('Product create successfuly!');
      /**Clear */
      setInput({
        title: '',
        cost: '',
        margin: '',
        price: '',
        description: '',
        image: '',
        // disable: false,
        like: '',
        stock: '',
        diet: '',
      })
      e.target.reset();
      window.location.reload(false);
      navigate('/productAdmin');
    }
  }; 
  /**Diet */
  function handleSelectDiets(e) {
    console.log('Handle ', e.target.value);
    setInput({
      ...input,
      diets: [...input.diets, e.target.value]
    });
  };
  /**Providers */
  function handleSelectProv(e) {
    console.log('HandlePro ', e.target.value);
    setInput({
      ...input,
      providers: [...input.providers, e.target.value]
    });
  };
  /**Categories */
  function handleSelectCate(e) {
    console.log('HandleCat ', e.target.value);
    setInput({
      ...input,
      categories: [...input.categories, e.target.value]
    });
  };
  function handleDelete(e) {
    e.preventDefault();   
    let [name, value] = e.target.value.split('_');   console.log(value); console.log(name);
    if(name === 'diets') {
      let d = input.diets.filter( (o)=> o !== value);
      setInput({...input, diets: d,});
    };
    if(name === 'providers') {
      let dt = input.providers.filter( (o)=> o !== value);
      setInput({...input, providers: dt,});
    };
    if(name === 'categories') {
      let dt = input.categories.filter( (o)=> o !== value);
      setInput({...input, categories: dt,});
    };
  };
  
  return (
    <>
      <h2>Product</h2>
      <form onSubmit={e => handleSubmit(e)}>
        <div id="Nombre" className="mb-3">
          <label
            className="form-label"
          >Name</label>
          <input
            id='title'
            className="form-control"
            type="text"
            placeholder="Product name"
            maxLength={50}
            autoFocus
            required={true}
            value={input.title}
            key='title'
            name='title'
            onChange={e => handleInputChange(e)} />
          {errors.title && (
            <p>{errors.title}</p>
          )}
        </div>
        <div id='Costo_Margen' className="row">
          <div id='Cost' className="col">
            <label
              className="form-label"
            >Provider price</label>
            <input
              id="cost"
              className="form-control"
              type="number"
              placeholder="5"
              value={input.cost}
              key='cost'
              name='cost'
              onChange={e => handleInputChange(e)}
            />
            {errors.cost && (
              <p>{errors.cost}</p>
            )}
          </div>
          <div id="Margen" className="col">
            <label
              className="form-label"
            >Margin</label>
            <input
              id="margin"
              className="form-control"
              type="number"
              placeholder="5"
              value={input.margin}
              key='margin'
              name='margin'
              onChange={e => handleInputChange(e)} />
            {errors.margin && (
              <p>{errors.margin}</p>
            )}

          </div>
        </div>
        <div id="PrecioPublico" className="mb-3">
          <label
            className="form-label"
          >Retail Price</label>
          {suggested >= 0 &&
            <p className={style.p_form}>Suggested integer: ${suggested}</p>}
          <input
            id="price"
            className="form-control"
            type="number"
            value={input.price}
            key='price'
            name='price'
            onChange={e => handleInputChange(e)} />
          {errors.price && (
            <p>{errors.price}</p>
          )}
        </div>
        <div id="Descripcion" className="mb-3">
          <label
            className="form-label"
          >Product description</label>
          <textarea
            id="description"
            className="form-control"
            type="text"
            placeholder="Choicely"
            required={true}
            maxLength={200}
            pattern={testDescription}
            value={input.description}
            key='description'
            name='description'
            onChange={e => handleInputChange(e)} />
          {errors.description && (
            <p>{errors.description}</p>
          )}
        </div>
        <div id="Image" className="mb-3">
          <label
            className="form-label"
          >Product Image</label>
          <input
            id="image"
            className="form-control"
            type="url"
            placeholder="📷 URL"
            maxLength={200}
            value={input.image}
            key='image'
            name="image"
            onChange={e => handleInputChange(e)}
          />
          {errors.image && <p className={style.p_form}>{errors.image}</p>}
        </div>
        <div id="Cantidad" className="mb-3">
          <label
            className="form-label"
          >Amount</label>
          <input
            id="stock"
            className="form-control"
            type="number"
            placeholder="🔢"
            required={true}
            value={input.stock}
            key='stock'
            name='stock'
            onChange={e => handleInputChange(e)}
          />
          {errors.stock && <p className={style.p_form}>{errors.stock}</p>}
        </div>
        <div id="Desactivo" className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckDefault"
            value={input.disable}
            onChange={e => handleInputChange(e)}
          />
          <label
            className="form-check-label"
          >Disable</label>
        </div>
        <div className={style.diet}>
          <select
            onChange={e => handleSelectDiets(e)}
            defaultValue='default'
            className={style.dietSelect}>
            <option
              value="default"
              disabled
              className={style.dietOption}>Choose diet</option>
            {diet &&
              diet.map((diet) => diet.name && (
                <option
                  key={diet.name}
                  value={diet.name}
                  className={style.dietOption}
                >
                  {diet.name}
                </option>
              ))
            }
          </select>
          {errors.diet && (
            <p style={{ float: 'right' }}>{errors.diet}</p>
          )}
          <div className={style.boxClose}>
          { input.diets?.map( (el, index) =>
            <div className={style.itemClose} key={`o${index}`}>
              <p>{el}</p>
              <button value={`diets_${el}`} onClick={(e)=>handleDelete(e)}>X</button>
            </div>)
          }
          </div>
        </div>
        <div className={style.providers}>
          <select
            onChange={e => handleSelectProv(e)}
            defaultValue='default'
            className={style.dietSelect}>
            <option
              value="default"
              disabled
              className={style.dietOption}>Choose Provider</option>
            {provider &&
              provider.map((prov) => prov.name && (
                <option
                  key={prov.name}
                  value={prov.name}
                  className={style.dietOption}
                >
                  {prov.name}
                </option>
              ))
            }
          </select>
          {errors.diet && (
            <p style={{ float: 'right' }}>{errors.diet}</p>
          )}
          <div className={style.boxClose}>
          { input.providers?.map( (el, index) =>
            <div className={style.itemClose} key={`o${index}`}>
              <p>{el}</p>
              <button value={`providers_${el}`} onClick={(e)=>handleDelete(e)}>X</button>
            </div>)
          }
          </div>
        </div>
        <div className={style.categories}>
          <select
            onChange={e => handleSelectCate(e)}
            defaultValue='default'
            className={style.dietSelect}>
            <option
              value="default"
              disabled
              className={style.dietOption}>Choose Categorie</option>
            {categories &&
              categories.map((cate) => cate.name && (
                <option
                  key={cate.name}
                  value={cate.name}
                  className={style.dietOption}
                >
                  {cate.name}
                </option>
              ))
            }
          </select>
          {errors.diet && (
            <p style={{ float: 'right' }}>{errors.diet}</p>
          )}
          <div className={style.boxClose}>
          { input.categories?.map( (el, index) =>
            <div className={style.itemClose} key={`o${index}`}>
              <p>{el}</p>
              <button value={`categories_${el}`} onClick={(e)=>handleDelete(e)}>X</button>
            </div>)
          }
          </div>
        </div>
        <div id="Guardar" className="d-grid gap-2">
          <input
            id={style.submit}
            className="btn btn-success"
            type="submit"
            value="Save"
            disabled={(!input.title || !input.price) ? true : false}
          />
        </div>
      </form>
    </>
  )
}
