import { HttpParams } from '@angular/common/http';

export function anonParam() {
  let param = new HttpParams();
  param = param.append('anon', 'anon');
  return param;
}
