/// <mls shortName="litIfDefined" project="100541" enhancement="_blank" />

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { nothing } from './_100541_litHtml';

/**
 * For AttributeParts, sets the attribute if the value is defined and removes
 * the attribute if the value is undefined.
 *
 * For other part types, this directive is a no-op.
 */
export const ifDefined = <T>(value: T) => value ?? nothing;