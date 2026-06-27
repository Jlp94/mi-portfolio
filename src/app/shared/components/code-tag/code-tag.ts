import { Component, input } from '@angular/core';

@Component({
  selector: 'app-code-tag',
  template: `
    @if (isClose()) {
      <span class="code-bracket">&lt;/</span><span class="code-tag">{{ tag() }}</span><span class="code-bracket">&gt;</span>
    } @else {
      <span class="code-bracket">&lt;</span><span class="code-tag">{{ tag() }}</span>@if (attrName()) {<span class="code-attr"> {{ attrName() }}=</span><span class="code-val">"{{ attrVal() }}"</span>}@if (classVal()) {<span class="code-attr"> class=</span><span class="code-val">"{{ classVal() }}"</span>}<span class="code-bracket">&gt;</span>
    }
  `,
  host: {
    '[style.display]': '"inline"'
  }
})
export class CodeTag {
  tag = input.required<string>();
  isClose = input<boolean>(false);
  attrName = input<string>('');
  attrVal = input<string>('');
  classVal = input<string>('');
}
