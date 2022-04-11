import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FactionTechDataService {

  /*
  level
  -- hull
  ---- stat
  */

  // data is directly copied from AL wikis fleet tech page
  // the hulls in each level are based on new tech in each level

  USS = {
    1: {
      CVL: {
        AVI: 1,
        RLD: 1,
        ASW: 2
      },
      CV: {
        AVI: 1,
        RLD: 1
      }
    },

    2: {
      DD: {
        AA: 2,
        RLD: 1,
      },
      DDG: {
        AA: 2,
        RLD: 1,
      },
      CL: {
        FP: 1,
        RLD: 1
      },
      CA: {
        FP: 1,
        RLD: 1
      },
      BM: {
        FP: 1,
        RLD: 1
      },
      CB: {
        FP: 1,
        RLD: 2
      }
    },

    3: {
      BC: {
        AA: 2,
        HIT: 2,
      },
      BB: {
        AA: 2,
        HIT: 2
      },
      BBV: {
        AA: 1,
        HIT: 1
      },
      AR: {
        AA: 5
      },
      AE: {
        AA: 5
      }
    },

    4: {
      CV: {
        AVI: 3,
        RLD: 3
      },
      CVL: {
        AVI: 3,
        RLD: 3,
        ASW: 5
      }
    },

    5: {
      DD: {
        AA: 5,
        RLD: 3,
      },
      DDG: {
        AA: 5,
        RLD: 3,
      },
      CL: {
        FP: 3,
        RLD: 3
      },
      CA: {
        FP: 3,
        RLD: 3
      },
      BM: {
        FP: 3,
        RLD: 3
      },
      CB: {
        FP: 3,
        RLD: 5
      }
    },
    
    6: {
      BC: {
        AA: 5,
        HIT: 5,
      },
      BB: {
        AA: 5,
        HIT: 5
      },
      BBV: {
        AA: 3,
        HIT: 3
      },
      AR: {
        AA: 10
      },
      AE: {
        AA: 10
      }
    },

    7: {
      CV: {
        AVI: 7,
        RLD: 7
      },
      CVL: {
        AVI: 7,
        RLD: 7,
        ASW: 10
      }
    },

    8: {
      DD: {
        AA: 10,
        RLD: 7,
      },
      DDG: {
        AA: 10,
        RLD: 7,
      },
      CL: {
        FP: 7,
        RLD: 7
      },
      CA: {
        FP: 7,
        RLD: 7
      },
      BM: {
        FP: 7,
        RLD: 7
      },
      CB: {
        FP: 7,
        RLD: 10
      }
    },

    9: {
      BC: {
        AA: 10,
        HIT: 10,
      },
      BB: {
        AA: 10,
        HIT: 10
      },
      BBV: {
        AA: 7,
        HIT: 7
      },
      AR: {
        AA: 15
      },
      AE: {
        AA: 15
      }
    }
  }

  HMS = {
    1: {
      CV: {
        AVI: 1,
        RLD: 1
      },
      CVL: {
        AVI: 2,
        RLD: 1,
        ASW: 2
      }
    },
    
    2: {
      DD: {
        EVA: 1,
        ASW: 2
      },
      DDG: {
        EVA: 1,
        ASW: 2
      },
      CL: {
        FP: 1,
        ASW: 2
      },
      CA: {
        FP: 1,
      },
      BM: {
        FP: 2
      },
      CB: {
        FP: 1
      }
    },

    3: {
      BC: {
        FP: 2,
        EVA: 2
      },
      BB: {
        FP: 1
      },
      BBV: {
        BBV: 1
      }
    },

    4: {
      CV: {
        AVI: 3,
        RLD: 3
      },
      CVL: {
        AVI: 5,
        RLD: 3,
        ASW: 5
      }
    },

    5: {
      DD: {
        EVA: 3,
        ASW: 5
      },
      DDG: {
        EVA: 3,
        ASW: 5
      },
      CL: {
        FP: 3,
        ASW: 5
      },
      CA: {
        FP: 3
      },
      BM: {
        FP: 5
      },
      CB: {
        FP: 3
      }
    },

    6: {
      BC: {
        FP: 5,
        EVA: 5
      },
      BB: {
        FP: 3
      },
      BBV: {
        FP: 3
      }
    },

    7: {
      CV: {
        AVI: 3,
        RLD: 7
      },
      CVL: {
        AVI: 10,
        RLD: 7,
        ASW: 10
      }
    },

    8: {
      DD: {
        EVA: 7,
        ASW: 10
      },
      DDG: {
        EVA: 7,
        ASW: 10
      },
      CL: {
        FP: 7,
        ASW: 10
      },
      CA: {
        FP: 7
      },
      BM: {
        FP: 10
      },
      CB: {
        FP: 7
      }
    }
  }

  IJN = {
    1: {
      CV: {
        AVI: 1
      },
      CVL: {
        AVI: 1
      },
      SS: {
        HP: 10,
        TRP: 2
      },
      SSV: {
        HP: 10,
        TRP: 2,
        AVI: 3
      }
    },

    2: {
      DD: {
        TRP: 1
      },
      DDG: {
        TRP: 1
      },
      CL: {
        TRP: 3
      },
      CA: {
        TRP :3
      },
      CB: {
        FP: 2
      }
    },

    3: {
      BC: {
        FP: 2
      },
      BB: {
        FP: 2
      },
      BBV: {
        FP: 2,
        AVI: 3
      },
      AR: {
        HP: 15
      },
      AE: {
        HP: 15
      }
    },

    4: {
      CV: {
        AVI: 3
      },
      CVL: {
        AVI: 3
      },
      SS: {
        HP: 25,
        TRP: 5
      },
      SSV: {
        HP: 25,
        TRP: 5,
        AVI: 5
      }
    },

    5: {
      DD: {
        TRP: 3
      },
      DDG: {
        TRP: 3
      },
      CL: {
        TRP: 7
      },
      CA: {
        TRP: 7
      },
      CB: {
        FP: 4
      }
    },

    6: {
      BC: {
        FP: 5
      },
      BB: {
        FP: 5
      },
      BBV: {
        FP: 5,
        AVI: 6
      },
      AR: {
        HP: 30
      },
      AE: {
        HP: 30
      }
    },

    7: {
      CV: {
        AVI: 7
      },
      CVL: {
        AVI: 7
      },
      SS: {
        HP: 50,
        TRP: 10
      },
      SSV: {
        HP: 50,
        TRP: 10,
        AVI: 9
      }
    },

    8: {
      DD: {
        TRP: 7
      },
      DDG: {
        TRP: 7
      },
      CL: {
        TRP: 13
      },
      CA: {
        TRP: 13
      },
      CB: {
        FP: 6
      }
    },

    9: {
      BC: {
        FP: 10
      },
      BB: {
        FP: 10
      },
      BBV: {
        FP: 10,
        AVI: 9
      },
      AR: {
        HP: 45
      },
      AE: {
        HP: 45
      }
    }
  }

  KMS = {
    1: {
      SS: {
        TRP: 3,
        HIT: 3,
        EVA: 3
      },
      SSV: {
        TRP: 3,
        HIT: 3,
        EVA: 3
      }
    },

    2: {
      DD: {
        HP: 10,
        FP: 4
      },
      DDG: {
        HP: 10,
        FP: 4
      },
      CA: {
        HP: 10,
        FP: 1
      },
      BM: {
        HP: 5,
        FP: 1
      },
      CB: {
        HP: 5,
        FP: 1
      }
    },

    3: {
      BC: {
        HP: 20
      },
      BB: {
        HP: 20
      },
      BBV: {
        HP: 15
      }
    },

    4: {
      SS: {
        TRP: 7,
        HIT: 7,
        EVA: 7
      },
      SSV: {
        TRP: 7,
        HIT: 7,
        EVA: 7
      }
    }
  }

  constructor() { }
}
