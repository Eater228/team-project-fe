import React, { useRef, useState } from 'react';
import styles from './CreatePage.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/Store'; // Adjust the import path as necessary
import ArrowBackIcon from '/img/icons/ArrowBack.svg'; // Adjust the import path as necessary
import { AuctionLotData, userService } from '../../Service/userService';
import classNames from 'classnames';

const categories = [
  "Art & Antiques",
  "Books",
  "Clothing & Footwear",
  "Records",
  "Transport",
  "Furniture",
  "Gadgets",
  "Toys",
  "Collections",
  "Sports Equipment",
  "Home Appliances",
  "Other"
];

export const CreatePage: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [openingPrice, setOpeningPrice] = useState('');
  const [closingPrice, setClosingPrice] = useState('');
  const [step, setStep] = useState('');
  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: boolean | string }>({});
  const [closingTime, setClosingTime] = useState('');
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.userData); // Get user data from userSlice

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      setImages(prevImages => [...prevImages, ...filesArray]);

      // Створення прев’ю зображень
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const newErrors: Record<string, string | boolean> = {};
    if (!name) newErrors.name = "Name is required";
    if (!description) newErrors.description = "Description is required";
    if (!openingPrice || isNaN(+openingPrice) || +openingPrice <= 0) newErrors.openingPrice = "Invalid opening price";
    if (closingPrice && (isNaN(+closingPrice) || +closingPrice <= 0)) newErrors.closingPrice = "Invalid closing price";
    if (!step || isNaN(+step) || +step <= 0) newErrors.step = "Invalid step";
    if (!closingTime) newErrors.closingTime = "Closing time is required";
    if (images.length === 0) newErrors.images = "At least one image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top if there are errors
      return;
    }

    const auctionData: AuctionLotData = {
      item_name: name,
      description,
      location: "New York", // Example location
      initial_price: openingPrice,
      min_step: step,
      buyout_price: closingPrice ? closingPrice : openingPrice,
      // close_time: closingTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      close_time: closingTime,
      category: 1,
      images_to_upload: images,
    };

    try {
      const result = await userService.createAuctionLot(auctionData);

      if (result) {
        setShowModal(true);
        // Clear all fields
        setName("");
        setDescription("");
        setOpeningPrice("");
        setClosingPrice("");
        setStep("");
        setCondition("new");
        setCategory("");
        setImages([]);
        setErrors({});
      } else {
        alert("Error creating auction. Please try again.");
      }
    } catch (error) {
      console.error("Auction creation error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleAddAnother = () => {
    setShowModal(false);
  };

  const handleGoHome = () => {
    navigate('/Home');
  };

  const sanitizePriceInput = (value: string) => value.replace(/^0+|\D/g, "").slice(0, 6);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizePriceInput(value);

    switch (name) {
      case "openingPrice":
        setOpeningPrice(sanitizedValue);
        break;
      case "closingPrice":
        setClosingPrice(sanitizedValue);
        break;
      case "step":
        setStep(sanitizedValue);
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleClosingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setClosingTime(e.target.value);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleNameBlur = () => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Name is required' }));
    } else if (name.trim().length < 3) {
      setErrors((prev) => ({ ...prev, name: 'Name must be at least 3 characters' }));
    } else {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleDescriptionBlur = () => {
    if (!description.trim()) {
      setErrors((prev) => ({ ...prev, description: 'Description is required' }));
    } else if (description.trim().split(' ').length < 5) {
      setErrors((prev) => ({ ...prev, description: 'Description must be at least 5 words' }));
    } else {
      setErrors((prev) => ({ ...prev, description: '' }));
    }
  };

  const maxClosingTime = new Date();
  maxClosingTime.setMonth(maxClosingTime.getMonth() + 1);
  const maxClosingTimeString = maxClosingTime.toISOString().split("T")[0]; // Формат YYYY-MM-DD
  const minClosingTimeString = new Date().toISOString().split("T")[0];


  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.showPicker(); // Відкриває календар при будь-якому кліку
  };

  return (
    <div className={styles.createPage}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.leftSection}>
          <div className={styles.stickyContainer}>
            <div className={styles.header}>
              <div className={styles.backButton} onClick={handleGoBack}>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
            />
            <label className={styles.inputLabel} htmlFor="name">Name of the item</label>
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>
          <div className={`${styles.formGroup} ${errors.description ? styles.error : ''}`}>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
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
                  value={openingPrice}
                  onChange={handlePriceChange}
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
                  value={closingPrice}
                  onChange={handlePriceChange}
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
                  value={step}
                  onChange={handlePriceChange}
                />
              </div>
            </div>
            <div className={`${styles.formGroupPrice} ${errors.closingTime ? styles.error : ''}`}>
              <label htmlFor="closingTime">Closing time</label>
              <div className={styles.inputWrapper}>
                <input
                  type="date"
                  id="closingTime"
                  value={closingTime}
                  onChange={handleClosingTimeChange}
                  onFocus={handleInputFocus}
                  min={minClosingTimeString}
                  max={maxClosingTimeString}
                  className={classNames(styles.datetime, { [styles.filled]: closingTime })}
                />
              </div>
            </div>
          </div>
          <div className={styles.formGroupRadio}>
            <div className={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  value="new"
                  checked={condition === 'new'}
                  onChange={(e) => setCondition(e.target.value)}
                />
                New
              </label>
              <label>
                <input
                  type="radio"
                  value="used"
                  checked={condition === 'used'}
                  onChange={(e) => setCondition(e.target.value)}
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
                <label key={cat}>
                  <input
                    type="radio"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                  {cat}
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
            <button onClick={handleAddAnother}>Add Another</button>
            <button onClick={handleGoHome}>Go Home</button>
          </div>
        </div>
      )}
    </div>
  );
};