export default {
  heading: {
    left: {
      button: 'Cancel',
      alert: {
        title: 'Cancel editing?',
        buttons: {
          save: 'Save draft',
          delete: 'Delete draft',
          cancel: 'Cancel'
        }
      }
    },
    right: {
      button: {
        default: 'Toot',
        conversation: 'Toot DM',
        reply: 'Toot reply',
        edit: 'Toot'
      },
      alert: {
        default: {
          title: 'Tooting failed',
          button: 'Try again'
        },
        removeReply: {
          title: 'Replied toot could not be found',
          description:
            'Replied toot could have been deleted. Do you want to remove it from your reference?',
          cancel: '$t(common:buttons.cancel)',
          confirm: 'Remove reference'
        }
      }
    }
  },
  content: {
    root: {
      header: {
        postingAs: 'Tooting as @{{acct}}@{{domain}}',
        spoilerInput: {
          placeholder: 'Spoiler warning message'
        },
        textInput: {
          placeholder: "What's on your mind"
        }
      },
      footer: {
        attachments: {
          sensitive: 'Mark attachments as sensitive'
        },
        poll: {
          option: {
            placeholder: {
              single: 'Single choice',
              multiple: 'Multiple choice'
            }
          },
          multiple: {
            heading: 'Choice type',
            options: {
              single: 'Single choice',
              multiple: 'Multiple choice',
              cancel: '$t(common:buttons.cancel)'
            }
          },
          expiration: {
            heading: 'Validity',
            options: {
              '300': '5 minutes',
              '1800': '30 minutes',
              '3600': '1 hour',
              '21600': '6 hours',
              '86400': '1 day',
              '259200': '3 days',
              '604800': '7 days',
              cancel: '$t(common:buttons.cancel)'
            }
          }
        }
      },
      actions: {
        attachment: {
          actions: {
            options: {
              library: 'Upload from photo library',
              photo: 'Upload with camera',
              cancel: '$t(common:buttons.cancel)'
            },
            library: {
              alert: {
                title: 'No permission',
                message: 'Require photo library read permission to upload',
                buttons: {
                  settings: 'Update setting',
                  cancel: 'Cancel'
                }
              }
            },
            photo: {
              alert: {
                title: 'No permission',
                message: 'Require camera usage permission to upload',
                buttons: {
                  settings: 'Update setting',
                  cancel: 'Cancel'
                }
              }
            }
          },
          failed: {
            alert: {
              title: 'Upload failed',
              button: 'Try again'
            }
          }
        },
        visibility: {
          title: 'Toot visibility',
          options: {
            public: 'Public',
            unlisted: 'Unlisted',
            private: 'Followers only',
            direct: 'Direct message',
            cancel: '$t(common:buttons.cancel)'
          }
        }
      },
      drafts: 'Draft ({{count}})',
      drafts_plural: 'Drafts ({{count}})'
    },
    editAttachment: {
      header: {
        title: 'Edit attachment',
        right: {
          failed: {
            title: 'Editing failed',
            button: 'Try again'
          }
        }
      },
      content: {
        altText: {
          heading: 'Describe media for the visually impaired',
          placeholder:
            'You can add a description, sometimes called alt-text, to your media so they are accessible to even more people, including those who are blind or visually impaired.\n\nGood descriptions are concise, but present what is in your media accurately enough to understand their context.'
        },
        imageFocus: 'Drag the focus circle to update focus point'
      }
    },
    draftsList: {
      header: {
        title: 'Draft'
      },
      content: {
        textEmpty: 'Content empty'
      }
    }
  }
}
