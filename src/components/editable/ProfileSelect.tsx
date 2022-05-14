import Fuse from 'fuse.js';
import React, { useEffect, useRef, useState } from 'react';
import { Profile } from '../../models/user.type';
import '../../styles/editable/ProfileSelect.scss';
import { getMembers } from '../../utils/api';
import { showErrorToast } from '../../utils/util';
import ProfileView from '../common/ProfileView';
import Select from './Select';

type ProfileSelectProps = {
  projectId: string;
  selectedProfile: Profile | null;
  onSelectProfile(profile: Profile): void;
  alwaysEditing?: boolean;
} & React.AllHTMLAttributes<HTMLDivElement>;

const fuseOptions: Fuse.IFuseOptions<Profile> = {
  keys: ['name'],
  ignoreLocation: true,
  distance: 10,
  includeScore: true,
  threshold: 0.3
}

export default function ProfileSelect({ 
    projectId,
    selectedProfile,
    onSelectProfile,
    alwaysEditing,
    className='',
    ...props
}: ProfileSelectProps) {

  const [profileName, setProfileName] = useState(selectedProfile?.name || '');
  const [fuse, setFuse] = useState<Fuse<Profile> | undefined>(undefined);
  const [fuseResults, setFuseResults] = 
    useState<Fuse.FuseResult<Profile>[] | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    handleProfileNameChange(selectedProfile?.name || '');
  }, [selectedProfile, fuse]);

  const handleInputFocus = async (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();

    if (fuse) {
      setFuse(fuse);
    } else {
      try {
        const members = await getMembers(projectId);
        setFuse(new Fuse(members, fuseOptions));
      } catch (err: any) {
        showErrorToast("Failed to fetch project members");
      }
    }
  };

  const handleInputBlur = (hasSelectedProfile: boolean) => {
    if (!hasSelectedProfile) {
      setProfileName(selectedProfile?.name || '');
    }
    inputRef.current?.blur();
  };

  const handleProfileNameChange = (newProfileName: string) => {
    setProfileName(newProfileName);
    setFuseResults(fuse?.search(newProfileName));
  };

  const options = fuseResults?.map(({ item }) => ({ 
    key: item.name,
    value: item,
    content: <ProfileView profile={item} showName={true}/>
  })) || [];

  return (
    <Select
        className={`profile-select ${className}`}
        options={options}
        onSelectOption={({ value }) => onSelectProfile(value)}
        onSelectClick={() => inputRef.current?.focus()}
        onSelectBlur={(hasSelectedProfile) => handleInputBlur(hasSelectedProfile)}
        alwaysEditing={alwaysEditing}>
      <ProfileView profile={profileName === selectedProfile?.name ? selectedProfile : undefined}/>
      <input 
          className="profile-input"
          ref={inputRef}
          value={profileName}
          onChange={(event) => handleProfileNameChange(event.target.value)}
          onFocus={handleInputFocus} />
    </Select>
  );
}
