export const userMessages = {
  InitSession: {
    BlockedUser: {
      title: 'You have been blocked temporally',
      message: 'You have been blocked since the quality of your last job was low.'
    },
    AccessDenied: {
      title: 'You have been blocked permanently',
      message: 'Your access has been revoked since the quality of the qualification was too low.'
    },
    ShouldWait: {
      title: 'Wait for a new job to be published',
      message: 'Please wait until a new job is open and published in the platform where you found this job previously.'
    }
  }
}

export const exceptions = {
  InvalidUrlException: {
    title: 'Invalid Url',
    message: 'Sorry, you have not entered a valid URL. Please check or copy and paste the complete provided link.'
  },
  InitSessionException: {
    title: 'Error starting task',
    message: 'Sorry, there was an error while starting the task. Please, try again.'
  },
  FinishSessionException: {
    title: 'Error finishing task',
    message: 'Sorry, there was an error while finishing the task. Please, try again.'
  },
  FetchDataException: {
    title: 'Error retrieving data',
    message: 'Sorry, there was an error while retrieving the data for the task. Please, try again.'
  },
  SaveDataException: {
    title: 'Error saving your answers',
    message: 'Sorry, there was an error while saving your answers. Please, try again.'
  },
  TestConductionError: {
    title: 'Error during the test',
    message: 'You didn\'t conducted the test properly. Please try again.'
  },
  RatingAudio: {
    SaveAudioException: {
      title: 'Error saving your rating',
      message: 'Sorry, there was an error while saving your rating. Please, try again.'
    }
  },
  QualificationTest: {
    FetchQualificationAudiosException: {
      title: 'Error retrieving data',
      message: 'Sorry, there was an error while retrieving the data for the task. Please, try again.'
    },
    FinishException: {
      title: 'Error saving data',
      message: 'Sorry, there was an error while saving your data for the task. Please, try again.'
    }
  },
  Setup: {
    FetchAudiosException: {
      title: 'Error retrieving data',
      message: 'Sorry, there was an error while retrieving the data for the task. Please, try again.'
    },
    FinishSetupException: {
      title: 'Error saving data',
      message: 'Sorry, there was an error while saving your data for the task setup. Please, try again.'
    },
    FinishException: {
      title: 'Error saving data',
      message: 'Sorry, there was an error while saving your ratings. Please, try again.'
    },
    NoMoreRatingAudios: {
      title: 'No more jobs',
      message: 'Sorry, but there are no more audios available for you to rate.'
    }
  },
  DemographicInfo: {
    AddDemographicInfoException: {
      title: 'Error saving your data',
      message: 'Sorry, there was an error while saving the answers you provided. Please, try again.'
    }
  },
  User: {
    SaveUser: {
      title: 'Error saving your data',
      message: 'Sorry, there was an error while saving the use\' data. Please, try again.'
    }
  },
  AudioPreloader: {
    LoadingException: {
      title: 'Error loading Audios',
      message: 'Sorry there was an error loading the audios for the task. Please, try again.'
    }
  },
  Audio: {
    PreparingException: {
      title: 'Error preparing an audio',
      message: 'Sorry there was an error preparing one of the audios for the task. Please, try again.'
    }
  }
}

export const userActions = {
  blurTab: {
    action: 'blur tab'
  },
  focusTab: {
    action: 'focus tab'
  }
}

export const paymentCodeProps = {
  prefix: '##',
  suffix: '##'
}

export const contactEmail = 'edwin.gamboa@tu-ilmenau.de'