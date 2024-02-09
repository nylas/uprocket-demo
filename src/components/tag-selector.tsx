import React, { useEffect, useState } from 'react'

interface TagSelectorProps {
  tags: string[]
  name: string
  preSelectedTags: string[]
  onTagChange: (selectedTags: string[]) => void
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  name,
  tags,
  preSelectedTags,
  onTagChange,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(preSelectedTags ?? [])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTags, setFilteredTags] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (searchTerm) {
      setFilteredTags(tags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }, [searchTerm, tags])

  const toggleTag = (tag: string) => {
    let updatedSelectedTags
    if (selectedTags.includes(tag)) {
      updatedSelectedTags = selectedTags.filter((t) => t !== tag)
    } else {
      updatedSelectedTags = [...selectedTags, tag]
    }
    setSelectedTags(updatedSelectedTags)
    onTagChange(updatedSelectedTags)
    setSearchTerm('')
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-wrap items-center border rounded-md p-2'>
        {selectedTags.map((tag) => (
          <div key={tag} className='bg-apple-700 text-white font-semibold rounded-md px-2 mr-2'>
            {tag}
            <button onClick={() => toggleTag(tag)} className='ml-1 text-white text-sm'>
              x
            </button>
          </div>
        ))}
        <input
          type='text'
          name={name}
          value={searchTerm}
          placeholder='Search and select tags...'
          className='flex-1 p-1'
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {showDropdown && filteredTags.length > 0 && (
        <div className='border rounded-md p-2 mt-1 max-h-60 overflow-auto'>
          {filteredTags.map((tag) => (
            <div
              key={tag}
              onClick={() => toggleTag(tag)}
              className='cursor-pointer hover:bg-gray-200 p-1'
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagSelector
