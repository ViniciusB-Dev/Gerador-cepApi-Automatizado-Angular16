import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Cep } from "./molal/cep";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  formCepForm: FormGroup | any;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.formCepForm = this.fb.group({
      bairro: [null, Validators.required],
      // Removendo o campo "cep" do formulário
      // cep: [null, Validators.required],
      complemento: [null, Validators.required],
      cidade: [null, Validators.required],
      estado: [null, Validators.required],
      numero: '',
      rua: [null, Validators.required],
    });
  }

  consultaCEP(cepValue: string) {
    let cepFormatado = cepValue.replace(/\D/g, '');

    if (cepFormatado !== '' && cepFormatado.length === 8) {
      let validacep = /^[0-9]{8}$/;

      if (validacep.test(cepFormatado)) {
        this.http.get(`https://viacep.com.br/ws/${cepFormatado}/json/`)
          .subscribe((dados: any) => this.preencherFormulario(dados));
      }
    } else {
      // Se o campo cep estiver vazio, limpa os campos do formulário
      this.limparCampos();
    }
  }

  preencherFormulario(dados: any): void {
    this.formCepForm.patchValue({
      bairro: dados.bairro,
      // Removendo a atribuição de dados para o campo "cep"
      // cep: dados.cep,
      complemento: dados.complemento,
      cidade: dados.localidade,
      estado: dados.uf,
      rua: dados.logradouro,
    });
  }

  formCepObjeto(): Cep {
    return {
      // Atualizando para obter o valor do campo "cep" do formulário diretamente
      cep: this.formCepForm.get('cep')?.value!,
      bairro: this.formCepForm.get('bairro')?.value!,
      complemento: this.formCepForm.get('complemento')?.value!,
      cidade: this.formCepForm.get('cidade')?.value!,
      estado: this.formCepForm.get('estado')?.value!,
      numero: this.formCepForm.get('numero')?.value!,
      rua: this.formCepForm.get('rua')?.value!,
    };
  }

  // Método para limpar os campos do formulário
  limparCampos(): void {
    this.formCepForm.reset({
      bairro: null,
      complemento: null,
      cidade: null,
      estado: null,
      numero: '',
      rua: null,
    });
  }
}
