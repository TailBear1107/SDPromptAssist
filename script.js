const promptData = {
  "動漫人物用": `bad anatomy,bad hands,missing fingers,extra fingers,three hands,three legs,bad arms,missing legs,missing arms,poorly drawn face,bad face,fused face,cloned face,three crus,fused feet,fused thigh,extra crus,ugly fingers,horn,realistic photo,huge eyes,worst face,2girl,long fingers,disconnected limbs`.split(','),
  "真實人物用": `bad anatomy,bad hands,missing fingers,extra fingers,three hands,three legs,bad arms,missing legs,missing arms,poorly drawn face,bad face,fused face,cloned face,three crus,fused feet,fused thigh,extra crus,ugly fingers,horn,cartoon,cg,3d,unreal,animate,amputation,disconnected limbs`.split(','),
  "風景照片用": `lowres,blurry,fog,hazy,overexposed,underexposed,oversaturated,washed out,poor lighting,low contrast,flat colors,compression artifacts,text overlay,people,manmade objects,buildings,cars,distortion,glare,lens flare,dirty lens,repetitive elements,unnatural shadows,tilted horizon`.split(',')
  };

  const baseCommon = `worst quality,normal quality,low quality,low res,blurry,text,watermark,logo,banner,extra digits,cropped,jpeg artifacts,signature,username,error,sketch,duplicate,ugly,monochrome,horror,geometry,mutation,disgusting,nsfw,nude,censored`.split(',');

  const categorySelect = document.getElementById('categorySelect');
  const checkboxList = document.getElementById('checkboxList');
  const promptSelection = document.getElementById('promptSelection');
  const weightSection = document.getElementById('weightSection');
  const weightCheckboxList = document.getElementById('weightCheckboxList');
  const weightInputs = document.getElementById('weightInputs');
  const resultSection = document.getElementById('resultSection');
  const finalOutput = document.getElementById('finalOutput');

  for (let key in promptData) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key;
    categorySelect.appendChild(option);
  }

  categorySelect.addEventListener('change', () => {
    const selected = categorySelect.value;
    if (!selected) return;

    promptSelection.style.display = 'block';
    weightSection.style.display = 'none';
    resultSection.style.display = 'none';
    checkboxList.innerHTML = '';

    const combinedPrompts = [...new Set([...promptData[selected], ...baseCommon])];

    combinedPrompts.forEach(p => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = p.trim();
      label.appendChild(input);
      label.appendChild(document.createTextNode(p.trim()));
      checkboxList.appendChild(label);
    });
  });

  checkboxList.addEventListener('change', () => {
    const checked = checkboxList.querySelectorAll('input:checked');
    if (checked.length === 0) {
      weightSection.style.display = 'none';
      return;
    }

    weightSection.style.display = 'block';
    weightCheckboxList.innerHTML = '';
    weightInputs.innerHTML = '';

    checked.forEach(item => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = item.value;
      input.dataset.prompt = item.value;
      label.appendChild(input);
      label.appendChild(document.createTextNode(item.value));
      weightCheckboxList.appendChild(label);
    });

    weightCheckboxList.addEventListener('change', () => {
      weightInputs.innerHTML = '';
      const selected = weightCheckboxList.querySelectorAll('input:checked');
      selected.forEach(input => {
        const div = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = input.value;
        const numInput = document.createElement('input');
        numInput.type = 'number';
        numInput.min = "1.0";
        numInput.max = "2.0";
        numInput.step = "0.1";
        numInput.value = "1.2";
        numInput.dataset.prompt = input.value;
        numInput.style.marginLeft = '10px';
        div.appendChild(label);
        div.appendChild(numInput);
        weightInputs.appendChild(div);
      });
    });
  });

  function generateFinalPrompt() {
    const allChecked = checkboxList.querySelectorAll('input:checked');
    const result = [];

    allChecked.forEach(item => {
      const weightInput = weightInputs.querySelector(`input[data-prompt="${item.value}"]`);
      if (weightInput) {
        const val = parseFloat(weightInput.value);
        if (val && val !== 1.0) {
          result.push(`(${item.value}:${val})`);
          return;
        }
      }
      result.push(item.value);
    });

    finalOutput.textContent = result.join(', ');
    resultSection.style.display = 'block';
    const btn = document.getElementById('copyBtn');
    btn.classList.remove('copied');
    btn.textContent = '📋 複製';
  }

  function copyResult(btn) {
    const text = finalOutput.textContent;
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btn.textContent = '✅ 已複製';
    });
  }

  function selectAllPrompts() {
    checkboxList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    checkboxList.dispatchEvent(new Event('change'));
  }