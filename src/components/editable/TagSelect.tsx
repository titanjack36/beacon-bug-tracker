import Fuse from 'fuse.js';
import React, { useEffect, useState } from "react";
import { Tag } from "../../models/task.type";
import { getTags } from '../../utils/api';
import { showErrorToast } from '../../utils/util';
import TagView from "../tasks/TagView";
import Select from "./Select";
import '../../styles/editable/TagSelect.scss';

const fuseOptions: Fuse.IFuseOptions<Tag> = {
  keys: ['value'],
  ignoreLocation: true,
  distance: 10,
  includeScore: true,
  threshold: 0.3
}

type TagSelectProps = {
  projectId: string;
  selectedTags: Tag[];
  onSelectedTagsChange(tags: Tag[]): void;
  alwaysEditing?: boolean;
} & React.AllHTMLAttributes<HTMLDivElement>;

export default function TagSelect({ projectId, selectedTags, onSelectedTagsChange, alwaysEditing, className, ...props }: TagSelectProps) {
  const [fuse, setFuse] = useState<Fuse<Tag> | undefined>(undefined);
  const [unselectedTags, setUnselectedTags] = useState<Tag[] | undefined>(undefined);
  const [fuseResults, setFuseResults] = 
    useState<Fuse.FuseResult<Tag>[] | undefined>(undefined);
  const [tagSearchPhrase, setTagSearchPhrase] = useState<string>('');

  useEffect(() => {
    if (tagSearchPhrase) {
      setFuseResults(fuse?.search(tagSearchPhrase));
    } else {
      setFuseResults(unselectedTags?.map(tag => ({ item: tag })) as Fuse.FuseResult<Tag>[] | undefined);
    }
  }, [tagSearchPhrase, fuse]);

  const handleSelectOpen = async () => {
    try {
      const allTags = await getTags(projectId);
      console.log(allTags);
      const remainingTags = allTags.filter(t1 => !selectedTags.find(t2 => t1.value === t2.value));
      setUnselectedTags(remainingTags);
      setFuse(new Fuse(remainingTags, fuseOptions));
    } catch (err: any) {
      showErrorToast("Failed to fetch project tags");
    }
  };

  const handleSelectTag = (tag: Tag) => {
    const newSelectedTags = [ ...selectedTags, tag ];
    
    onSelectedTagsChange(newSelectedTags);
  };

  const handleAddTag = () => {
    const newTagValue = tagSearchPhrase;
    if (selectedTags.find(t => t.value === newTagValue)) {
      showErrorToast("Tag already exists");
      return;
    }
    const newTag = { value: newTagValue, color: 'green' };
    onSelectedTagsChange([ ...selectedTags, newTag ]);
  };

  const handleDeleteTag = (event: React.MouseEvent, tag: Tag) => {
    event.stopPropagation();
    onSelectedTagsChange(selectedTags.filter(t => t.value !== tag.value));
  };

  const options = fuseResults?.map(({ item }) => ({
    key: item.value,
    value: item,
    content: <TagView key={item.value} tag={item} />
  })) || [];
  const tagSearchInput = (
    <div className="tag-search-wrapper">
      <input
          className="tag-search-input"
          placeholder="Search tags"
          value={tagSearchPhrase}
          onChange={event => setTagSearchPhrase(event.target.value)}/>
      {
        Boolean(tagSearchPhrase.length) && (
          <button className="add-tag" onClick={handleAddTag}>
            <span className="icon icon-plus"></span>
          </button>
        )
      }
    </div>
  );

  return (
    <Select
        className={`tag-select ${className}`}
        options={options}
        onSelectOption={({ value }) => handleSelectTag(value)}
        onSelectClick={() => handleSelectOpen()}
        dropdownHeader={tagSearchInput}
        alwaysEditing={alwaysEditing}
        {...props}>
      {
        selectedTags.map(tag => <TagView key={tag.value} tag={tag} className="field" onDelete={(event) => handleDeleteTag(event, tag)}/>)
      }
    </Select>
  );
}
