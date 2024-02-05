import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { getUser } from '../../api';

type Props = {
  selectedTodo: Todo;
  onClose: () => void;
};

export const TodoModal: React.FC<Props> = ({ selectedTodo, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const {
    id, title, completed, userId,
  } = selectedTodo;

  useEffect(() => {
    setLoading(true);
    getUser(userId)
      .then(setUser)
      .catch(() => setErrorMessage('Some Error'))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="modal is-active" data-cy="modal">
      <div className="modal-background" />

      {loading && <Loader />}
      {!loading && !errorMessage && (
        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              {`Todo #${id}`}
            </div>

            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={onClose}
            />
          </header>

          <div className="modal-card-body">
            <p className="block" data-cy="modal-title">
              {title}
            </p>

            <p className="block" data-cy="modal-user">
              {completed ? (
                <strong className="has-text-success">Done</strong>
              ) : (
                <strong className="has-text-danger">Planned</strong>
              )}

              {' by '}

              {!user ? (
                <span>Unknown User</span>
              ) : (
                <a href={`mailto:${user.email}`}>
                  {user.name}
                </a>
              )}
            </p>
          </div>
        </div>
      )}

      {!loading && !!errorMessage && (
        <p className="has-text-danger">{errorMessage}</p>
      )}
    </div>
  );
};