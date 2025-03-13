import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './CreatePage.module.scss';
import ArrowBackIcon from '/img/icons/ArrowBack.svg';
import { AuctionLotData, userService } from '../../Service/userService';
import classNames from 'classnames';
import { fetchCategories } from '../../Reducer/categoriesSlice';
import { AppDispatch, RootState } from '../../Store/Store';

type FormState = {
  name: string;
  description: string;
  openingPrice: string;
  closingPrice: string;
  step: string;
  condition: string;
  category: number;
  closingTime: string;
};

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formState, setFormState] = useState<FormState>({
    name: '',
    description: '',
    openingPrice: '',
    closingPrice: '',
    step: '',
    condition: 'new',
    category: 0,
    closingTime: ''
  });

  const categories = useSelector((state: RootState) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newPreviews = files.map(URL.createObjectURL);

    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  }, []);

  const validateField = useCallback((name: keyof FormState, value: string) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return '';
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().split(/\s+/).length < 5) return 'Description must be at least 5 words';
        return '';
      default:
        return '';
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormState(prev => ({
      ...prev,
      [name]: type === 'radio' && name === 'category' ? Number(value) : value
    }));

    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof FormState, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const { name, description, openingPrice, step, closingTime } = formState;

    newErrors.name = validateField('name', name);
    newErrors.description = validateField('description', description);

    if (!openingPrice || isNaN(+openingPrice) || +openingPrice <= 0) {
      newErrors.openingPrice = "Invalid opening price";
    }
    if (!step || isNaN(+step) || +step <= 0) {
      newErrors.step = "Invalid step";
    }
    if (!closingTime) {
      newErrors.closingTime = "Closing time is required";
    }
    if (images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    return Object.entries(newErrors).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  }, [formState, images, validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const auctionData: AuctionLotData = {
      item_name: formState.name,
      description: formState.description,
      location: "New York",
      initial_price: formState.openingPrice,
      min_step: formState.step,
      buyout_price: formState.closingPrice || formState.openingPrice,
      close_time: formState.closingTime,
      category: formState.category,
      images_to_upload: images,
    };

    try {
      const result = await userService.createAuctionLot(auctionData);
      if (result) {
        setShowModal(true);
        setFormState({
          name: '',
          description: '',
          openingPrice: '',
          closingPrice: '',
          step: '',
          condition: 'new',
          category: 0,
          closingTime: ''
        });
        setImages([]);
        setImagePreviews([]);
        setErrors({});
      }
    } catch (error) {
      console.error("Auction creation error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  }, [formState, images, validateForm]);

  const maxClosingTime = new Date();
  maxClosingTime.setMonth(maxClosingTime.getMonth() + 1);
  const [minClosingTimeString, maxClosingTimeString] = [new Date(), maxClosingTime]
    .map(d => d.toISOString().split("T")[0]);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.showPicker();

  return (
    <div className={styles.createPage}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.leftSection}>
          <div className={styles.stickyContainer}>
            <div className={styles.header}>
              <div className={styles.backButton} onClick={() => navigate(-1)}>
                <img src={ArrowBackIcon} alt="Back" />
              </div>
              <div>
                <h1>Creating an auction</h1>
                <p>Input all required information</p>
              </div>
            </div>
            <div className={styles.imageUpload}>
              <div className={styles.imageBlock}>
                <div className={styles.mainImage} onClick={!images[0] ? openFilePicker : undefined}>
                  {images[0] ? (
                    <div className={styles.imageContainer}>
                      <img src={imagePreviews[0]} alt="Main Auction" className={styles.image} />
                      <button type="button" className={styles.removeButton} onClick={() => handleRemoveImage(0)}>
                        <img src="/img/icons/Trash.svg" alt="" />
                      </button>
                    </div>
                  ) : (
                    <img src="/img/icons/AddImage.png" alt="Placeholder" className={styles.image} />
                  )}
                </div>
                <div className={styles.smallImages}>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className={styles.smallImageContainer}
                      onClick={!images[index + 1] ? openFilePicker : undefined}
                    >
                      {images[index + 1] ? (
                        <div className={styles.imageContainer}>
                          <img src={imagePreviews[index + 1]} alt={`Auction ${index + 1}`} className={styles.smallImage} />
                          <button type="button" className={styles.removeButton} onClick={() => handleRemoveImage(index + 1)}>
                            <img src="/img/icons/Trash.svg" alt="" />
                          </button>
                        </div>
                      ) : (
                        <img src="/img/icons/AddImage.png" alt="Placeholder" className={styles.smallImage} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              {errors.images && <span className={styles.errorText}>{errors.images}</span>}
            </div>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={`${styles.formGroup} ${errors.name ? styles.error : ''}`}>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label className={styles.inputLabel} htmlFor="name">Name of the item</label>
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>
          <div className={`${styles.formGroup} ${errors.description ? styles.error : ''}`}>
            <textarea
              id="description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={500}
            />
            <label className={styles.inputLabel} htmlFor="description">Description</label>
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
          </div>
          <div className={styles.fullWidthLine}></div>
          <div className={styles.PriceSection}>
            <div className={`${styles.formGroupPrice} ${errors.openingPrice ? styles.error : ''}`}>
              <label htmlFor="openingPrice">Opening price</label>
              <div className={styles.inputWrapper}>
                <span className={styles.dollarSign}>$</span>
                <input
                  type="text"
                  name="openingPrice"
                  value={formState.openingPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={`${styles.formGroupPrice} ${errors.closingPrice ? styles.error : ''}`}>
              <label htmlFor="closingPrice">Closing price (optional)</label>
              <div className={styles.inputWrapper}>
                <span className={styles.dollarSign}>$</span>
                <input
                  type="text"
                  name="closingPrice"
                  value={formState.closingPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={`${styles.formGroupPrice} ${errors.step ? styles.error : ''}`}>
              <label htmlFor="step">Step</label>
              <div className={styles.inputWrapper}>
                <span className={styles.dollarSign}>$</span>
                <input
                  type="text"
                  name="step"
                  value={formState.step}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={`${styles.formGroupPrice} ${errors.closingTime ? styles.error : ''}`}>
              <label htmlFor="closingTime">Closing time</label>
              <div className={styles.inputWrapper}>
                <input
                  type="date"
                  id="closingTime"
                  name="closingTime"
                  value={formState.closingTime}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  min={minClosingTimeString}
                  max={maxClosingTimeString}
                  className={classNames(styles.datetime, { [styles.filled]: formState.closingTime })}
                />
              </div>
            </div>
          </div>
          <div className={styles.formGroupRadio}>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="condition" // Додано name
                  value="new"
                  checked={formState.condition === 'new'}
                  onChange={handleChange}
                />
                New
              </label>
              <label>
                <input
                  type="radio"
                  name="condition" // Додано name
                  value="used"
                  checked={formState.condition === 'used'}
                  onChange={handleChange}
                />
                Used
              </label>
            </div>
          </div>
          <div className={styles.fullWidthLine}></div>
          <div className={styles.formGroupRadio}>
            <h2>Category</h2>
            <div className={styles.radioGroup}>
              {categories.map((cat) => (
                <label key={cat.id}>
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={formState.category === cat.id}
                    onChange={handleChange}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className={styles.createButton}>Create Auction</button>
        </div>
      </form>
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Auction Created Successfully!</h2>
            <button onClick={() => setShowModal(false)}>Add Another</button>
            <button onClick={() => navigate('/Home')}>Go Home</button>
          </div>
        </div>
      )}
    </div>
  );
};