import React, { useRef, useState } from 'react';
import styles from './CreatePage.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store/Store'; // Adjust the import path as necessary
import ArrowBackIcon from '/img/icons/ArrowBack.svg'; // Adjust the import path as necessary

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
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [openingPrice, setOpeningPrice] = useState('');
  const [closingPrice, setClosingPrice] = useState('');
  const [step, setStep] = useState('');
  const [condition, setCondition] = useState('new');
  const [category, setCategory] = useState(categories[0]);
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
      const filesArray = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prevImages => [...prevImages, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const newErrors: { [key: string]: boolean } = {};
    if (!name) newErrors.name = true;
    if (!description) newErrors.description = true;
    if (!openingPrice || isNaN(Number(openingPrice)) || Number(openingPrice) <= 0) newErrors.openingPrice = true;
    if (closingPrice && (isNaN(Number(closingPrice)) || Number(closingPrice) <= 0)) newErrors.closingPrice = true;
    if (!step || isNaN(Number(step)) || Number(step) <= 0) newErrors.step = true;
    if (!closingTime) newErrors.closingTime = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const auctionData = {
      category,
      images,
      name,
      fullPrice: Number(closingPrice) || Number(openingPrice),
      startPrice: Number(openingPrice),
      currentPrice: Number(openingPrice),
      bet: Number(step),
      bids: [],
      seller: { id: user.currentUser?.id, name: `${user.currentUser?.first_name} ${user.currentUser?.last_name}` },
      status: "active",
      state: condition,
      location: "New York, USA", // Example location
      startingTime: new Date().toISOString(),
      endTime: closingTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      description,
    };
    console.log(JSON.stringify(auctionData, null, 2));

    // Clear all fields
    setImages([]);
    setName('');
    setDescription('');
    setOpeningPrice('');
    setClosingPrice('');
    setStep('');
    setCondition('new');
    setCategory(categories[0]);
    setErrors({});

    // Show modal
    setShowModal(true);
  };

  const handleAddAnother = () => {
    setShowModal(false);
  };

  const handleGoHome = () => {
    navigate('/Home');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'openingPrice') {
      setOpeningPrice(value.replace(/[^0-9]/g, '').slice(0, 6));
    } else if (name === 'closingPrice') {
      setClosingPrice(value.replace(/[^0-9]/g, '').slice(0, 6));
    } else if (name === 'step') {
      setStep(value.replace(/[^0-9]/g, '').slice(0, 6));
    }
  };

  const handleClosingTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const maxClosingTimeString = maxClosingTime.toISOString().slice(0, 16);
  const minClosingTimeString = new Date().toISOString().slice(0, 16);

  return (
    <div className={styles.createPage}>
      <div className={styles.backButton} onClick={handleGoBack}>
        <img src={ArrowBackIcon} alt="Back" />
      </div>
      <div className={styles.header}>
        <h1>Creating an auction</h1>
        <p>Input all required information</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.leftSection}>
          <div className={styles.imageUpload}>
            <div className={styles.imageBlock}>
              <div className={styles.mainImage} onClick={!images[0] ? openFilePicker : undefined}>
                {images[0] ? (
                  <div className={styles.imageContainer}>
                    <img src={images[0]} alt="Main Auction" className={styles.image} />
                    <button className={styles.removeButton} onClick={() => handleRemoveImage(0)}>
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
                        <img src={images[index + 1]} alt={`Auction ${index + 1}`} className={styles.smallImage} />
                        <button className={styles.removeButton} onClick={() => handleRemoveImage(index + 1)}>
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
              required
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
              required
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
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.replace(/[^0-9]/g, '').length > 6) {
                      input.value = `${input.value.replace(/[^0-9]/g, '').slice(0, 6)}`;
                    }
                  }}
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
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.replace(/[^0-9]/g, '').length > 6) {
                      input.value = `${input.value.replace(/[^0-9]/g, '').slice(0, 6)}`;
                    }
                  }}
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
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    if (input.value.replace(/[^0-9]/g, '').length > 6) {
                      input.value = `${input.value.replace(/[^0-9]/g, '').slice(0, 6)}`;
                    }
                  }}
                  onChange={handlePriceChange}
                />
              </div>
            </div>
            <div className={`${styles.formGroupPrice} ${errors.closingTime ? styles.error : ''}`}>
              <label htmlFor="closingTime">Closing time</label>
              <div className={styles.inputWrapper}>
                <input
                  type="datetime-local"
                  id="closingTime"
                  value={closingTime}
                  onChange={handleClosingTimeChange}
                  min={minClosingTimeString}
                  max={maxClosingTimeString}
                  className={styles.datetime}
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
            <label>Category</label>
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