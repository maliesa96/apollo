from django import forms

class homeInput(forms.Form):
    title = forms.CharField(label='', max_length=200,
                              widget=forms.TextInput(attrs={'class' : 'form-control newpoll',
                                                              'name' : 'newpoll',
                                                              'type' : 'text',
                                                              'required' : 'true',
                                                              'placeholder' :'Type a Question or #RoomID',
                                                              'style' : 'height: 40px; max-width: 500px; border-radius: 2rem;'
                                                           }))
    type = forms.ChoiceField(choices=[('mc','Multiple Choice'), ('yn','Yes/No'), ('n','Numbered')], widget=forms.RadioSelect)

    anonymous = forms.BooleanField(label='', required=False, widget=forms.CheckboxInput())
    private = forms.BooleanField(label='', required=False, widget=forms.CheckboxInput())

class Choices(forms.Form):
    choice=forms.CharField(label='',max_length=200,
                           widget=forms.TextInput(attrs={'class': 'form-control option',
                                                         'autocomplete': 'off',
                                                         'style': 'width: 90%; border-radius: 0.7rem; background-color: var(--mydarkgrey)',
                           }))

class Numbered(forms.Form):
    start = forms.FloatField(label='', required = False,
                            widget=forms.TextInput(attrs={'class': 'form-control option',
                                                          'autocomplete': 'off',
                                                          'placeholder': 'Start',
                                                          }))
    end = forms.FloatField(label='', required = False,
                            widget=forms.TextInput(attrs={'class': 'form-control option',
                                                          'autocomplete': 'off',
                                                          'placeholder': 'End',
                                                          }))

class AdminForm(forms.Form):
    title = forms.CharField(label='', max_length=200,
                              widget=forms.TextInput(attrs={'class' : 'form-control newpoll',
                                                              'name' : 'admin-newpoll',
                                                              'type' : 'text',
                                                              'required' : 'true',
                                                              'placeholder' :'Type a Question',
                                                              'style' : 'height: 40px; max-width: 500px; border-radius: 2rem;'
                                                           }))


class MCForm(forms.Form):

    choice = forms.ChoiceField(choices=[], widget=forms.RadioSelect, required = True)

    def __init__(self, options, *args, **kwargs): #pass options to form when instantiated

        self.options = options
        super(MCForm,self).__init__(*args, **kwargs)
        self.fields['choice'].choices = self.options

class NumberedForm(forms.Form):

    vote = forms.FloatField(min_value=None, max_value=None, widget=forms.NumberInput, required = True)

    def __init__(self, min, max, *args, **kwargs): #pass options to form when instantiated

        self.min = min
        self.max = max
        super(NumberedForm,self).__init__(*args, **kwargs)
        self.fields['vote'].min_value = self.min
        self.fields['vote'].max_value = self.max

class YesNoForm(forms.Form):
    choice = forms.ChoiceField(label=False, choices=[('Yes','Yes'),('No','No')], widget=forms.RadioSelect, required=True)
