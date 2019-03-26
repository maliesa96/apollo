from django import template
from polls.models import Option, YesNoVote, NumberedVote
from django.utils.safestring import mark_safe
import json

register = template.Library()

@register.simple_tag
def mc_legend_data(poll):

    data = []

    o = Option.objects.filter(poll=poll)
    for option in o:
        label = option.option
        votes = len(option.mcvote_set.all())
        count = len(poll.mcvote_set.all())
        percent = round(votes/(count if count > 0 else 1)*100,1) #make sure not to divide by 0

        data.append((label, votes, percent))
    data_json = mark_safe(json.dumps(data))

    return data, data_json

    #result: [(option 1, 100, 33%), (option 2, 200, 66%)...]


@register.simple_tag
def yn_legend_data(poll):

    v = YesNoVote.objects.filter(poll=poll)
    yes_count = len(v.filter(vote='Yes'))
    no_count = len(v.filter(vote='No'))
    yes_percent = round(yes_count/(len(v) if len(v) > 0 else 1)*100,1) #make sure not to divide by 0
    no_percent = round(no_count/(len(v) if len(v) > 0 else 1)*100,1) #make sure not to divide by 0

    data = [('Yes',yes_count, yes_percent), ('No', no_count, no_percent)]
    data_json = mark_safe(json.dumps(data))

    return data, data_json

    #result: [('Yes', 20, 33.3%), ('No', 40, 66.6%)]

@register.simple_tag
def n_legend_data(poll):
    votes = list(NumberedVote.objects.filter(poll=poll).values_list('vote', flat=True))

    mean = round((sum(votes) if votes is not None else 0)/(len(votes) if len(votes) > 0 else 1),2)
    #mode = max(set(votes), key=votes.count)

    data = {'votes': votes,
            'avg': mean}

    data_json = mark_safe(json.dumps(data))

    return data, data_json

    #result: { 'votes': [1.00, 2.5, ..],
    #           'avg': 7 }


@register.filter(is_safe=True)
def jsn(obj):
    return mark_safe(json.dumps(obj))