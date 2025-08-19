'use client';

import { useState } from 'react';

import { AttachImagesInput, AttachImagesThumbnail } from '@/components/common';

import deletePreviewImage from '@/hooks/auction/useDeletePreview';
import useOnChangePreview from '@/hooks/auction/useOnChangePreview';

interface ImagesUploaderProps {
  id: string;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  existingImages?: string[]; // 기존 이미지 URL 배열
  isEdit?: boolean; // 수정 모드 여부
  onRemoveExistingImage?: (imageUrl: string) => void; // 기존 이미지 삭제 콜백
}

const AttachImages = ({
  id,
  setFiles,
  existingImages = [],
  isEdit = false,
  onRemoveExistingImage,
}: ImagesUploaderProps) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const currentImgLength = previewImages.length;

  const { handleChange, syncCurrentFiles } = useOnChangePreview(
    () => {},
    setPreviewImages,
    setFiles
  );

  const handleDeleteNewImage = (index: number) => {
    deletePreviewImage({
      setImgLength: () => {},
      setPreviewImages,
      setFiles,
      index,
      onFilesChange: syncCurrentFiles,
    });
  };

  const handleDeleteExistingImage = (imageUrl: string) => {
    if (onRemoveExistingImage) {
      onRemoveExistingImage(imageUrl);
    }
  };

  const totalImagesCount = existingImages.length + currentImgLength;

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    const wouldExceedLimit = totalImagesCount + imageFiles.length > 8;
    if (wouldExceedLimit) {
      const availableSlots = Math.max(0, 8 - totalImagesCount);
      if (availableSlots === 0) {
        alert('이미지는 최대 8개까지 업로드할 수 있습니다.');
        return;
      }
      alert(`이미지는 최대 8개까지 등록할 수 있습니다. ${availableSlots}개만 추가됩니다.`);
    }
    handleChange(e);
  };

  return (
    <div className="flex h-20 items-center gap-2">
      <AttachImagesInput onChange={handleNewImageChange} imgLength={totalImagesCount} id={id} />
      <div className="scrollbar-hide-x flex w-full gap-1">
        {isEdit &&
          existingImages.map((imageUrl) => (
            <AttachImagesThumbnail
              key={`existing-${imageUrl}`}
              url={imageUrl}
              handleDelete={() => handleDeleteExistingImage(imageUrl)}
            />
          ))}

        {previewImages.map((item, index) => (
          <AttachImagesThumbnail
            key={`new-${index}-${item}`}
            url={item}
            handleDelete={() => handleDeleteNewImage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AttachImages;
