/*
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import * as Types from '@a2ui/web_core/types/types';

export const theme: Types.Theme = {
  additionalStyles: {},
  components: {
    AudioPlayer: {},
    Button: {
      'layout-pt-2': true,
      'layout-pb-2': true,
      'layout-pl-3': true,
      'layout-pr-3': true,
      'border-br-4': true,
      'border-bw-0': true,
      'border-bs-s': true,
      'color-bgc-p30': true,
      'color-c-n100': true,
      'behavior-ho-70': true,
    },
    Card: {
      'border-br-4': true,
      'color-bgc-n100': true,
      'color-bc-n90': true,
      'border-bw-1': true,
      'border-bs-s': true,
      'layout-p-4': true,
    },
    CheckBox: {
      element: {},
      label: {},
      container: {},
    },
    Column: {
      'layout-g-2': true,
    },
    DateTimeInput: {
      container: {},
      label: {},
      element: {},
    },
    Divider: {
      'color-bgc-n90': true,
      'layout-mt-4': true,
      'layout-mb-4': true,
    },
    Image: {
      all: {
        'border-br-4': true,
        'layout-el-cv': true,
      },
      avatar: {},
      header: {},
      icon: {},
      largeFeature: {},
      mediumFeature: {},
      smallFeature: {},
    },
    Icon: {},
    List: {
      'layout-g-2': true,
    },
    Modal: {
      backdrop: {},
      element: {
        'border-br-4': true,
        'color-bgc-n100': true,
        'layout-p-4': true,
      },
    },
    MultipleChoice: {
      container: {},
      label: {},
      element: {},
    },
    Row: {
      'layout-g-2': true,
    },
    Slider: {
      container: {},
      label: {},
      element: {},
    },
    Tabs: {
      container: {},
      controls: { all: {}, selected: {} },
      element: {},
    },
    Text: {
      all: {},
      h1: {},
      h2: {},
      h3: {},
      h4: {},
      h5: {},
      body: {},
      caption: {},
    },
    TextField: {
      container: {},
      label: {},
      element: {
        'layout-pt-2': true,
        'layout-pb-2': true,
        'layout-pl-3': true,
        'layout-pr-3': true,
        'border-br-4': true,
        'border-bw-1': true,
        'border-bs-s': true,
        'color-bc-n80': true,
      },
    },
    Video: {
      'border-br-4': true,
      'layout-el-cv': true,
    },
  },
  elements: {
    a: {},
    audio: {},
    body: {},
    button: {},
    h1: {},
    h2: {},
    h3: {},
    h4: {},
    h5: {},
    iframe: {},
    input: {},
    p: {},
    pre: {},
    textarea: {},
    video: {},
  },
  markdown: {
    p: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    ul: [],
    ol: [],
    li: [],
    a: [],
    strong: [],
    em: [],
  },
};
