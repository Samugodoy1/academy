import { CURRENT_PRODUCT } from '../config/product';
import type { Product } from '../types/clinical';

export const DEFAULT_PRODUCT: Product = CURRENT_PRODUCT;
export const ACADEMY_DISABLED_TABS = new Set(['financeiro', 'documentos', 'inteligencia', 'portal', 'academy']);
