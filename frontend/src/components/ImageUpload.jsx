import { useState } from 'react'
import { draftsService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const ImageUpload = ({ onUploadSuccess, onUploadError }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned'

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      setError('Lütfen bir resim dosyası seçin')
      return
    }

    // Dosya boyutu kontrolü (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Dosya boyutu 10MB\'dan büyük olamaz')
      return
    }

    setError('')
    setSelectedFile(file)

    // Preview oluştur
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const uploadToCloudinary = async (file) => {
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary cloud name yapılandırılmamış')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error('Cloudinary upload başarısız')
    }

    const data = await response.json()
    return data.secure_url
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Lütfen bir dosya seçin')
      return
    }

    setUploading(true)
    setError('')

    try {
      // 1. Cloudinary'e yükle
      const imageUrl = await uploadToCloudinary(selectedFile)
      console.log('Image uploaded to Cloudinary:', imageUrl)

      // 2. Backend OCR endpoint'ine gönder
      console.log('OCR işlemi başlatılıyor...')
      const draft = await draftsService.processImage(imageUrl)
      console.log('OCR tamamlandı, draft oluşturuldu:', draft)

      if (onUploadSuccess) {
        onUploadSuccess({
          imageUrl,
          draft,
          message: 'Resim başarıyla yüklendi ve OCR işlemi tamamlandı.'
        })
      }

      // Reset form
      setSelectedFile(null)
      setPreview(null)
      
    } catch (err) {
      console.error('Upload error:', err)
      const errorMessage = err.message || 'Resim yüklenirken hata oluştu'
      setError(errorMessage)
      
      if (onUploadError) {
        onUploadError(errorMessage)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setPreview(null)
    setError('')
  }

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem'
      }}>
        📸 Maç Fotoğrafı Yükle
      </h3>

      {error && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#fee2e2',
          color: 'var(--danger-color)',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {!preview ? (
        <div>
          <label style={{
            display: 'block',
            padding: '2rem',
            border: '2px dashed var(--border-color)',
            borderRadius: '0.375rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={uploading}
            />
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
              <div style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                Fotoğraf seç veya sürükle-bırak
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                PNG, JPG, JPEG (max 10MB)
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-color)'
              }}
            />
            <button
              onClick={handleRemove}
              className="btn btn-danger"
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem'
              }}
              disabled={uploading}
            >
              ✕
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleUpload}
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={uploading}
            >
              {uploading ? 'Yükleniyor...' : '📤 Yükle ve OCR İşle'}
            </button>
            <button
              onClick={handleRemove}
              className="btn btn-secondary"
              disabled={uploading}
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {!CLOUDINARY_CLOUD_NAME && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fef3c7',
          color: '#92400e',
          borderRadius: '0.375rem',
          fontSize: '0.875rem'
        }}>
          ⚠️ Cloudinary yapılandırılmamış. Lütfen .env dosyasında VITE_CLOUDINARY_CLOUD_NAME ayarlayın.
        </div>
      )}
    </div>
  )
}

export default ImageUpload

