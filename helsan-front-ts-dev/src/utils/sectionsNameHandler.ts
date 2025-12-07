interface Section {
    _id: string;
    sectionName: string;
  }
  
  interface Place {
    sections?: Section[];
  }
  
  interface ProfileInfo {
    placeId?: Place;
  }
  
  interface SectionsNameHandlerParams {
    profileInfo?: ProfileInfo;
    subClinicId: string;
    t: (key: string) => string;
  }
  
  export const sectionsNameHandler = ({
    profileInfo,
    subClinicId,
    t,
  }: SectionsNameHandlerParams): string => {
    const section: Section | undefined =
      profileInfo?.placeId?.sections?.find(
        (section) => section._id === subClinicId
      );
  
    return section ? section.sectionName : t('sectionClinic');
  };
  